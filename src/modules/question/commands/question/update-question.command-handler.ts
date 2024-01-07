import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { UpdateQuestionCommand } from './update-question.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { UpdateQuestionPayload } from '@modules/question/graphql/types/question/update-question-mutation-types';
import { QuestionNode } from '@modules/question/graphql/types/question/question-connection-types';

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionCommandHandler extends BaseCommandHandler implements ICommandHandler<UpdateQuestionCommand> {
    @Transactional()
    async execute(command: UpdateQuestionCommand): Promise<UpdateQuestionPayload> {
        let question = await this.dbContext.questions.findOne({
            where: { id: command.id },
        });

        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        question = { ...question, ...command };

        await this.dbContext.questions.save(question);

        return { question: plainToClass(QuestionNode, question) };
    }
}
