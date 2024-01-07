import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { MarkAsReadPayload } from '../graphql/types/mark-as-read-mutation-types';
import { MarkAsReadCommand } from './mark-as-read.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@CommandHandler(MarkAsReadCommand)
export class MarkAsReadCommandHandler extends BaseCommandHandler implements ICommandHandler<MarkAsReadCommand> {
    async execute(command: MarkAsReadCommand): Promise<MarkAsReadPayload> {
        const { id, isRead } = command;
        const feedback = await this.dbContext.feedbacks.findOneBy({ id });

        if (!feedback) {
            throw new NotFoundException(ErrorCode.FEEDBACK_NOT_FOUND);
        }

        feedback.isRead = isRead;

        await this.dbContext.feedbacks.save(feedback);

        return { success: true };
    }
}
