import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { In } from 'typeorm';
import { DeleteManagersCommand } from './delete-managers.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(DeleteManagersCommand)
export class DeleteManagersCommandHandler extends BaseCommandHandler implements ICommandHandler<DeleteManagersCommand> {
    async execute({ ids }: DeleteManagersCommand): Promise<boolean> {
        const managers = await this.dbContext.managers.find({
            where: { id: In(ids) },
            relations: ['user'],
        });

        if (managers.length !== ids.length) {
            throw new NotFoundException(ErrorCode.MANAGER_NOT_FOUND);
        }

        const users = managers.map((m) => m.user);
        await this.dbContext.users.softRemove(users);

        await this.dbContext.managers.softRemove(managers);

        return true;
    }
}
