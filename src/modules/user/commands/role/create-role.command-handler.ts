import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { RoleNode } from '../../graphql/types/connection-types/role-connection-types';
import { CreateRolePayload } from '../../graphql/types/create-role-mutation-types';
import { CreateRoleCommand } from './create-role.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(CreateRoleCommand)
export class CreateRoleCommandHandler extends BaseCommandHandler implements ICommandHandler<CreateRoleCommand> {
    @Transactional()
    async execute({ name, permissions }: CreateRoleCommand): Promise<CreateRolePayload> {
        const rolePermissions = permissions.map(({ parameterId, permissionId }) => {
            return this.dbContext.rolePermissions.create({
                permissionId,
                parameterId,
            });
        });

        const role = await this.dbContext.roles.save({ name, rolePermissions });

        return {
            role: plainToClass(RoleNode, role),
        };
    }
}
