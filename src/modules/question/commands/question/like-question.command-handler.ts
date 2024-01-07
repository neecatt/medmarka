import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { LikeQuestionCommand } from './like-question.command';
import { DeleteQuestionDislikeCommand } from './delete-question-dislike.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { LikeQuestionPayload } from '@modules/question/graphql/types/question-like/like-question-mutation-types';

@CommandHandler(LikeQuestionCommand)
export class LikeQuestionCommandHandler extends BaseCommandHandler implements ICommandHandler<LikeQuestionCommand> {
    constructor(private readonly commandBus: CommandBus) {
        super();
    }

    @Transactional()
    async execute({ questionId, userId }: LikeQuestionCommand): Promise<LikeQuestionPayload> {
        const question = await this.dbContext.questions.findOneBy({ id: questionId });
        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const oldLike = await this.dbContext.questionLikes.findOne({
            where: { questionId, userId },
            withDeleted: true,
        });

        console.log(oldLike);

        const disLike = await this.dbContext.questionDislikes.findOne({
            where: { questionId, userId },
            withDeleted: true,
        });

        if (disLike) {
            const deleteDislike = new DeleteQuestionDislikeCommand();
            deleteDislike.questionId = questionId;
            deleteDislike.userId = userId;
            await this.commandBus.execute(deleteDislike);
        }

        if (oldLike) {
            if (!oldLike.deletedAt) {
                throw new BadRequestException(ErrorCode.QUESTION_ALREADY_LIKED);
            } else {
                await this.dbContext.questionLikes.recover(oldLike);
            }
        } else {
            const questionLike = this.dbContext.questionLikes.create({ questionId, userId });
            await this.dbContext.questionLikes.save(questionLike);
        }

        await this.dbContext.questions.increment({ id: question.id }, 'likeCount', 1);

        return { likeCount: question.likeCount + 1 };
    }
}
