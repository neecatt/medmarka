import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { ManagerNode } from '../graphql/types/manager-connection-types';
import { UpdateManagerPayload } from '../graphql/types/update-manager-mutation-types';
import { UpdateManagerCommand } from './update-manager.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@CommandHandler(UpdateManagerCommand)
export class UpdateManagerCommandHandler extends BaseCommandHandler implements ICommandHandler<UpdateManagerCommand> {
    @Transactional()
    async execute({
        userId,
        phoneNumber,
        firstName,
        jobTitle,
        lastName,
        dateOfBirth,
        gender,
    }: UpdateManagerCommand): Promise<UpdateManagerPayload> {
        const manager = await this.dbContext.managers.findOne({
            where: { userId },
            relations: ['user', 'user.details'],
        });

        if (!manager) {
            throw new NotFoundException(ErrorCode.MANAGER_NOT_FOUND);
        }

        await this.dbContext.managers.save({ ...manager });

        const { user } = manager;

        await this.dbContext.users.save({
            ...user,
            firstName,
            lastName,
            details: { ...user.details, jobTitle, phoneNumber, dateOfBirth, gender },
        });

        return { manager: plainToClass(ManagerNode, manager) };
    }
}
