import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UnBlockAnswerPayload } from '../graphql/types/unblock-answer-mutation-types';
import { AnswerStatus } from '../domain/enums/answer-status';
import { UnBlockAnswerCommand } from './unblock-comment.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@CommandHandler(UnBlockAnswerCommand)
export class UnBlockAnswerCommandHandler extends BaseCommandHandler implements ICommandHandler<UnBlockAnswerCommand> {
    async execute({ answerId }: UnBlockAnswerCommand): Promise<UnBlockAnswerPayload> {
        const answer = await this.dbContext.answers.findOneBy({ id: answerId });
        if (!answer) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        if (answer.status === AnswerStatus.PUBLISHED) {
            throw new BadRequestException(ErrorCode.ANSWER_ALREADY_PUBLISHED);
        }

        answer.status = AnswerStatus.PUBLISHED;

        await this.dbContext.answers.save(answer);

        return { status: answer.status };
    }
}
