import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { DeleteQuestionLikeCommand } from './delete-question-like.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { DeleteQuestionLikePayload } from '@modules/question/graphql/types/question-like/delete-question-like-mutation-types';

@CommandHandler(DeleteQuestionLikeCommand)
export class DeleteQuestionLikeCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<DeleteQuestionLikeCommand>
{
    @Transactional()
    async execute({ questionId, userId }: DeleteQuestionLikeCommand): Promise<DeleteQuestionLikePayload> {
        const question = await this.dbContext.questions.findOneBy({ id: questionId });
        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const questionLike = await this.dbContext.questionLikes.findOne({ where: { userId, questionId } });
        console.log(questionLike);
        console.log({ questionId, userId }, 'sdsdsdsdsd');

        if (!questionLike) {
            throw new BadRequestException(ErrorCode.QUESTION_ALREADY_LIKE_DELETED);
        }

        await this.dbContext.questionLikes.softRemove(questionLike);

        await this.dbContext.questions.decrement({ id: question.id }, 'likeCount', 1);

        return { likeCount: question.likeCount - 1 };
    }
}
