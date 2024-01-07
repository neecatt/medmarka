import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BlockAnswerPayload } from '../graphql/types/block-answer-mutation-types';
import { AnswerStatus } from '../domain/enums/answer-status';
import { BlockAnswerCommand } from './block-answer.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@CommandHandler(BlockAnswerCommand)
export class BlockAnswerCommandHandler extends BaseCommandHandler implements ICommandHandler<BlockAnswerCommand> {
    async execute({ answerId }: BlockAnswerCommand): Promise<BlockAnswerPayload> {
        const answer = await this.dbContext.answers.findOneBy({ id: answerId });
        if (!answer) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        if (answer.status === AnswerStatus.BLOCKED) {
            throw new BadRequestException(ErrorCode.ANSWER_ALREADY_BLOCKED);
        }

        answer.status = AnswerStatus.BLOCKED;

        await this.dbContext.answers.save(answer);

        return { status: answer.status };
    }
}
