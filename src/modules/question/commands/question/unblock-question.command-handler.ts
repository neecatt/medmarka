import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UnBlockQuestionCommand } from './unblock-question.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { QuestionStatus } from '@modules/question/domain/enums/question-status';
import { UnBlockQuestionPayload } from '@modules/question/graphql/types/question/unblock-question-mutation-types';

@CommandHandler(UnBlockQuestionCommand)
export class UnBlockQuestionCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<UnBlockQuestionCommand>
{
    async execute({ questionId }: UnBlockQuestionCommand): Promise<UnBlockQuestionPayload> {
        const question = await this.dbContext.questions.findOneBy({ id: questionId });
        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        if (question.status === QuestionStatus.PUBLISHED) {
            throw new BadRequestException(ErrorCode.QUESTION_ALREADY_PUBLISHED);
        }

        question.status = QuestionStatus.PUBLISHED;

        await this.dbContext.questions.save(question);

        return { status: question.status };
    }
}
