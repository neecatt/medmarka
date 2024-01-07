import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { RoleNode } from '../../graphql/types/connection-types/role-connection-types';
import { UpdateRoleCommand } from './update-role.command';
import { UpdateRolePayload } from '@modules/user/graphql/types/update-role-mutation-types';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { Role } from '@modules/user/domain/models/role.entity';
import { PermissionInput } from '@modules/user/graphql/types/create-role-mutation-types';
import { PermissionService } from '@modules/user/service/permission.service';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleCommandHandler extends BaseCommandHandler implements ICommandHandler<UpdateRoleCommand> {
    constructor(private readonly permissionService: PermissionService) {
        super();
    }

    @Transactional()
    async execute({ id, name, permissions }: UpdateRoleCommand): Promise<UpdateRolePayload> {
        const role = await this.dbContext.roles.findOne({
            where: { id },
            relations: ['rolePermissions'],
        });

        await this.updateRolePermissions(role, name, permissions);

        await this.updateUserPermissions(role);

        return {
            role: plainToClass(RoleNode, role),
        };
    }

    async updateRolePermissions(role: Role, name: string, newPermissions: PermissionInput[]): Promise<void> {
        await this.dbContext.rolePermissions.remove(role.rolePermissions);

        const rolePermissions = newPermissions.map(({ parameterId, permissionId }) => ({
            permissionId,
            parameterId,
            roleId: role.id,
        }));

        await this.dbContext.roles.save({ ...role, name, rolePermissions });
    }

    async updateUserPermissions(role: Role): Promise<void> {
        const userRoles = await this.dbContext.userRoles.find({
            where: { roleId: role.id },
            relations: ['user', 'user.userPermissions'],
        });

        for (const userRole of userRoles) {
            await this.permissionService.assignRolePermissionsToUser(userRole.user, [role]);
        }
    }
}
