import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { DeleteRoleCommand } from './delete-role.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { Role } from '@modules/user/domain/models/role.entity';
import { DeleteRolePayload } from '@modules/user/graphql/types/delete-role-payload';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleCommandHandler extends BaseCommandHandler implements ICommandHandler<DeleteRoleCommand> {
    @Transactional()
    async execute({ id }: DeleteRoleCommand): Promise<DeleteRolePayload> {
        const role = await this.dbContext.roles.findOne({ where: { id }, relations: ['rolePermissions', 'userRoles'] });

        if (!role) throw new NotFoundException(ErrorCode.ROLE_NOT_FOUND);

        await this.deleteUserRelations(role);

        if (role.rolePermissions.length) await this.dbContext.rolePermissions.remove(role.rolePermissions);

        await this.dbContext.roles.remove(role);

        return { id };
    }

    async deleteUserRelations(role: Role): Promise<void> {
        const userRoles = await this.dbContext.userRoles.find({
            where: { roleId: role.id },
            relations: ['user', 'user.userPermissions'],
        });

        for (const { user } of userRoles) {
            const userPermissions = await this.dbContext.userPermissions.find({ where: { userId: user.id } });
            if (userPermissions.length) await this.dbContext.userPermissions.remove(userPermissions);
        }

        if (role.userRoles.length) await this.dbContext.userRoles.remove(role.userRoles);
    }
}
