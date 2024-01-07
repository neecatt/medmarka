import { QueryBus } from '@nestjs/cqrs';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PermissionConnection, PermissionNode } from '../types/connection-types/permission-connection-types';
import {
    PermissionParameterConnection,
    PermissionParameterNode,
} from '../types/connection-types/permission-parameter-connection-types';
import { AuthorizePermissions } from '@modules/auth/decorators/authorize-permission.decorator';
import { getConnectionFromArray } from '@modules/shared/graphql/relay';
import { PermissionName } from '@modules/user/domain/enums/permission-name';
import { PermissionParameterLoader } from '@modules/user/loaders/permission-parameter.loader';
import { GetAllPermisionsQuery } from '@modules/user/queries/permission/get-all-permissions.query';

@Resolver(() => PermissionNode)
export class PermissionResolver {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly permissionParameterLoader: PermissionParameterLoader,
    ) {}

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => PermissionConnection, { nullable: true })
    async permissions(): Promise<PermissionConnection> {
        return await this.queryBus.execute(new GetAllPermisionsQuery());
    }

    @ResolveField(() => PermissionParameterConnection, { nullable: true })
    async parameters(@Parent() permission: PermissionNode): Promise<PermissionParameterConnection> {
        const permissionParameters = await this.permissionParameterLoader.byPermissionId.load(permission.id);
        return getConnectionFromArray(permissionParameters, PermissionParameterNode);
    }
}
