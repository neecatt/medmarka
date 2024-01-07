import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BlockQuestionCommand } from './block-question.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { BlockQuestionPayload } from '@modules/question/graphql/types/question/block-question-mutation-types';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { QuestionStatus } from '@modules/question/domain/enums/question-status';

@CommandHandler(BlockQuestionCommand)
export class BlockQuestionCommandHandler extends BaseCommandHandler implements ICommandHandler<BlockQuestionCommand> {
    async execute({ questionId }: BlockQuestionCommand): Promise<BlockQuestionPayload> {
        const question = await this.dbContext.questions.findOneBy({ id: questionId });
        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        if (question.status === QuestionStatus.BLOCKED) {
            throw new BadRequestException(ErrorCode.QUESTION_ALREADY_BLOCKED);
        }

        question.status = QuestionStatus.BLOCKED;

        await this.dbContext.questions.save(question);

        return { status: question.status };
    }
}
