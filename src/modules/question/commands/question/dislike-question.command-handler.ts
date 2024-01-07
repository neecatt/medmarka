import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { DislikeQuestionCommand } from './dislike-question.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { DislikeQuestionPayload } from '@modules/question/graphql/types/question-dislike/dislike-question-mutation-types';
import { DeleteQuestionLikeCommand } from './delete-question-like.command';

@CommandHandler(DislikeQuestionCommand)
export class DislikeQuestionCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<DislikeQuestionCommand>
{
    constructor(private readonly commandBus: CommandBus) {
        super();
    }

    @Transactional()
    async execute({ questionId, userId }: DislikeQuestionCommand): Promise<DislikeQuestionPayload> {
        const question = await this.dbContext.questions.findOneBy({ id: questionId });
        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const oldDislike = await this.dbContext.questionDislikes.findOne({
            where: { questionId, userId },
            withDeleted: true,
        });

        const like = await this.dbContext.questionLikes.findOne({
            where: { questionId, userId },
            withDeleted: true,
        });

        if (like) {
            const deleteLike = new DeleteQuestionLikeCommand();
            deleteLike.questionId = questionId;
            deleteLike.userId = userId;
            await this.commandBus.execute(deleteLike);
        }

        if (oldDislike) {
            if (!oldDislike.deletedAt) {
                throw new BadRequestException(ErrorCode.QUESTION_ALREADY_DISLIKED);
            } else {
                await this.dbContext.questionDislikes.recover(oldDislike);
            }
        } else {
            const questionLike = this.dbContext.questionDislikes.create({ questionId, userId });
            await this.dbContext.questionDislikes.save(questionLike);
        }

        await this.dbContext.questions.increment({ id: question.id }, 'dislikeCount', 1);

        return { dislikeCount: question.dislikeCount + 1 };
    }
}
