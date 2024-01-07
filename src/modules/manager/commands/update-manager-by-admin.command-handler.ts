import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { Not } from 'typeorm';
import { ManagerNode } from '../graphql/types/manager-connection-types';
import { UpdateManagerPayload } from '../graphql/types/update-manager-mutation-types';
import { UpdateManagerByAdminCommand } from './update-manager-by-admin.command';
import { PermissionService } from '@modules/user/service/permission.service';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { User } from '@modules/user/domain/models/user.entity';

@CommandHandler(UpdateManagerByAdminCommand)
export class UpdateManagerCommandByAdminHandler
    extends BaseCommandHandler
    implements ICommandHandler<UpdateManagerByAdminCommand>
{
    constructor(private readonly permissionService: PermissionService) {
        super();
    }
    @Transactional()
    async execute({
        id,
        phoneNumber,
        firstName,
        jobTitle,
        lastName,
        email,
        dateOfBirth,
        gender,
        roleIds,
    }: UpdateManagerByAdminCommand): Promise<UpdateManagerPayload> {
        const manager = await this.dbContext.managers.findOne({
            where: { id },
            relations: ['user', 'user.details', 'user.userPermissions', 'user.userRoles', 'user.userRoles.role'],
        });

        if (!manager) {
            throw new NotFoundException(ErrorCode.MANAGER_NOT_FOUND);
        }

        const existUser = await this.dbContext.users.findOne({ where: { id: Not(manager.userId), email: email } });

        if (existUser) {
            throw new BadRequestException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        await this.dbContext.managers.save({ ...manager });

        const updatedUser = {
            ...manager.user,
            firstName,
            lastName,
            email,
            details: { ...manager.user.details, jobTitle, phoneNumber, dateOfBirth, gender },
        };

        await this.dbContext.users.save(updatedUser);

        if (roleIds?.length) {
            await this.updateRoles(updatedUser, roleIds);
        }

        return { manager: plainToClass(ManagerNode, manager) };
    }

    private async updateRoles(updatedUser: Partial<User>, newRoleIds: string[]): Promise<void> {
        const userRoles = await this.dbContext.userRoles.find({ where: { userId: updatedUser.id } });

        await this.dbContext.userRoles.remove(userRoles);

        const newRoles = await this.permissionService.findRoles(newRoleIds);

        await this.permissionService.assignRolePermissionsToUser(updatedUser, newRoles);

        await this.dbContext.userRoles.save(newRoles.map((r) => ({ roleId: r.id, userId: updatedUser.id })));
    }
}
