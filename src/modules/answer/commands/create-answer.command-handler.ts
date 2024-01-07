import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { CreateAnswerPayload } from '../graphql/types/create-answer-mutation-types';
import { AnswerNode } from '../graphql/types/answer-connection-types';
import { CreateAnswerCommand } from './create-answer.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(CreateAnswerCommand)
export class CreateAnswerCommandHandler extends BaseCommandHandler implements ICommandHandler<CreateAnswerCommand> {
    @Transactional()
    async execute(command: CreateAnswerCommand): Promise<CreateAnswerPayload> {
        const { questionId, text, userId } = command;

        const question = await this.dbContext.questions.findOneBy({ id: questionId });

        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOne({ where: { id: userId }, relations: { doctor: true } });

        if (userId && !user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const answer = this.dbContext.answers.create({ question, text, user });

        if (user.doctor) {
            answer.index = 2;
        }

        await this.dbContext.answers.save(answer);

        return { answer: plainToClass(AnswerNode, answer) };
    }
}
