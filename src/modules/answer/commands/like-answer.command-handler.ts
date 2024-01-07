import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { LikeAnswerPayload } from '../graphql/types/answer-like/like-answer-mutation-types';
import { LikeAnswerCommand } from './like-answer.command';
import { DeleteAnswerDislikeCommand } from './delete-answer-dislike.command';

@CommandHandler(LikeAnswerCommand)
export class LikeAnswerCommandHandler extends BaseCommandHandler implements ICommandHandler<LikeAnswerCommand> {
    constructor(private readonly commandBus: CommandBus) {
        super();
    }

    @Transactional()
    async execute({ answerId, userId }: LikeAnswerCommand): Promise<LikeAnswerPayload> {
        const answer = await this.dbContext.answers.findOneBy({ id: answerId });
        if (!answer) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const oldLike = await this.dbContext.answerLikes.findOne({
            where: { answerId, userId },
            withDeleted: true,
        });

        const disLike = await this.dbContext.answerDislikes.findOne({
            where: { answerId, userId },
            withDeleted: true,
        });

        if (disLike) {
            const deleteDislike = new DeleteAnswerDislikeCommand();
            deleteDislike.answerId = answerId;
            deleteDislike.userId = userId;
            await this.commandBus.execute(deleteDislike);
        }

        if (oldLike) {
            if (!oldLike.deletedAt) {
                throw new BadRequestException(ErrorCode.ANSWER_ALREADY_LIKED);
            } else {
                await this.dbContext.answerLikes.recover(oldLike);
            }
        } else {
            const answerLike = this.dbContext.answerLikes.create({ answerId, userId });
            await this.dbContext.answerLikes.save(answerLike);
        }

        await this.dbContext.answers.increment({ id: answer.id }, 'likeCount', 1);

        return { likeCount: answer.likeCount + 1 };
    }
}
