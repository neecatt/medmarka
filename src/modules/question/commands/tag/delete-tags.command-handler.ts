import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { DeleteTagsCommand } from './delete-tags.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(DeleteTagsCommand)
export class DeleteTagsCommandHandler extends BaseCommandHandler implements ICommandHandler<DeleteTagsCommand> {
    @Transactional()
    async execute({ ids }: DeleteTagsCommand): Promise<boolean> {
        const tags = await this.dbContext.tags.find({
            where: { id: In(ids) },
        });

        if (tags.length !== ids.length) {
            throw new NotFoundException(ErrorCode.TAG_NOT_FOUND);
        }

        await this.dbContext.tags.softRemove(tags);

        return true;
    }
}
