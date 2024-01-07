import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { DislikeAnswerPayload } from '../graphql/types/answer-dislike/dislike-answer-mutation-types';
import { DislikeAnswerCommand } from './dislike-answer.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { DeleteAnswerLikeCommand } from './delete-answer-like.command';

@CommandHandler(DislikeAnswerCommand)
export class DislikeAnswerCommandHandler extends BaseCommandHandler implements ICommandHandler<DislikeAnswerCommand> {
    constructor(private readonly commandBus: CommandBus) {
        super();
    }

    @Transactional()
    async execute({ answerId, userId }: DislikeAnswerCommand): Promise<DislikeAnswerPayload> {
        const answer = await this.dbContext.answers.findOneBy({ id: answerId });
        if (!answer) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const oldDislike = await this.dbContext.answerDislikes.findOne({
            where: { answerId, userId },
            withDeleted: true,
        });

        const like = await this.dbContext.answerLikes.findOne({
            where: { answerId, userId },
            withDeleted: true,
        });

        if (like) {
            const deleteLike = new DeleteAnswerLikeCommand();
            deleteLike.answerId = answerId;
            deleteLike.userId = userId;
            await this.commandBus.execute(deleteLike);
        }

        if (oldDislike) {
            if (!oldDislike.deletedAt) {
                throw new BadRequestException(ErrorCode.ANSWER_ALREADY_DISLIKED);
            } else {
                await this.dbContext.answerDislikes.recover(oldDislike);
            }
        } else {
            const answerLike = this.dbContext.answerDislikes.create({ answerId, userId });
            await this.dbContext.answerDislikes.save(answerLike);
        }

        await this.dbContext.answers.increment({ id: answer.id }, 'dislikeCount', 1);

        return { dislikeCount: answer.dislikeCount + 1 };
    }
}
