import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UpdateAnswerPayload } from '../graphql/types/update-answer-mutation-types';
import { AnswerNode } from '../graphql/types/answer-connection-types';
import { UpdateAnswerCommand } from './update-answer.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(UpdateAnswerCommand)
export class UpdateAnswerCommandHandler extends BaseCommandHandler implements ICommandHandler<UpdateAnswerCommand> {
    async execute(command: UpdateAnswerCommand): Promise<UpdateAnswerPayload> {
        const { id, userId, text } = command;
        let answer = await this.dbContext.answers.findOne({
            where: { id, userId },
        });

        if (!answer) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        answer = { ...answer, text };

        await this.dbContext.answers.save(answer);

        return { answer: plainToClass(AnswerNode, answer) };
    }
}
