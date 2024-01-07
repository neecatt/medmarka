import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { PermissionNode } from '../types/connection-types/permission-connection-types';
import { RolePermissionNode } from '../types/connection-types/role-permission-connection-types';
import { PermissionParameterNode } from '../types/connection-types/permission-parameter-connection-types';
import { PermissionLoader } from '@modules/user/loaders/permission.loader';
import { PermissionParameterLoader } from '@modules/user/loaders/permission-parameter.loader';

@Resolver(() => RolePermissionNode)
export class RolePermissionResolver {
    constructor(
        private readonly permissionLoader: PermissionLoader,
        private readonly parameterLoader: PermissionParameterLoader,
    ) {}

    @ResolveField(() => PermissionNode)
    async permission(@Parent() parent: RolePermissionNode): Promise<PermissionNode> {
        const permission = await this.permissionLoader.byId.load(parent.permissionId);
        return plainToClass(PermissionNode, permission);
    }

    @ResolveField(() => PermissionParameterNode)
    async parameter(@Parent() parent: RolePermissionNode): Promise<PermissionParameterNode> {
        const parameter = await this.parameterLoader.byId.load(parent.parameterId);
        return plainToClass(PermissionParameterNode, parameter);
    }
}
