import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { DeleteQuestionDislikeCommand } from './delete-question-dislike.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { DeleteQuestionDislikePayload } from '@modules/question/graphql/types/question-dislike/delete-question-dislike-mutation-types';

@CommandHandler(DeleteQuestionDislikeCommand)
export class DeleteQuestionDislikeCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<DeleteQuestionDislikeCommand>
{
    @Transactional()
    async execute({ questionId, userId }: DeleteQuestionDislikeCommand): Promise<DeleteQuestionDislikePayload> {
        const question = await this.dbContext.questions.findOneBy({ id: questionId });
        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const questionDislike = await this.dbContext.questionDislikes.findOne({
            where: { questionId: questionId, userId: userId },
        });
        console.log(questionDislike);
        if (!questionDislike) {
            throw new BadRequestException(ErrorCode.QUESTION_ALREADY_LIKED);
        }

        await this.dbContext.questionDislikes.softRemove(questionDislike);

        await this.dbContext.questions.decrement({ id: question.id }, 'dislikeCount', 1);

        return { dislikeCount: question.dislikeCount - 1 };
    }
}
