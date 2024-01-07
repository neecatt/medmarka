import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { DeleteCommentsCommand } from './delete-comments.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(DeleteCommentsCommand)
export class DeleteCommentsCommandHandler extends BaseCommandHandler implements ICommandHandler<DeleteCommentsCommand> {
    @Transactional()
    async execute({ ids }: DeleteCommentsCommand): Promise<boolean> {
        const comments = await this.dbContext.comments.find({
            where: { id: In(ids) },
        });

        if (comments.length !== ids.length) {
            throw new NotFoundException(ErrorCode.COMMENT_NOT_FOUND);
        }

        await this.dbContext.comments.softRemove(comments);
        return true;
    }
}
