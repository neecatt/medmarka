import { QueryBus } from '@nestjs/cqrs';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { PermissionNode } from '../types/connection-types/permission-connection-types';
import { PermissionParameterNode } from '../types/connection-types/permission-parameter-connection-types';
import { UserNode } from '../types/connection-types/user-connection-types';
import {
    UserPermissionConnection,
    UserPermissionNode,
} from '../types/connection-types/user-permission-connection-types';
import { UserPermissionConnectionArgs } from '../types/user-permission-connection-args';
import { GetAllUserPermisionsQuery } from '@modules/user/queries/permission/get-all-user-permissions.query';
import { UserLoader } from '@modules/user/loaders/user-loader';
import { PermissionLoader } from '@modules/user/loaders/permission.loader';
import { PermissionParameterLoader } from '@modules/user/loaders/permission-parameter.loader';
import { AuthorizeUser } from '@modules/auth/decorators/authorize-user.decorator';

@Resolver(() => UserPermissionNode)
export class UserPermissionResolver {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly userLoader: UserLoader,
        private readonly permissionLoader: PermissionLoader,
        private readonly parameterLoader: PermissionParameterLoader,
    ) {}

    @AuthorizeUser()
    @Query(() => UserPermissionConnection, { nullable: true })
    async userPermissions(@Args() args: UserPermissionConnectionArgs): Promise<UserPermissionConnection> {
        return await this.queryBus.execute(new GetAllUserPermisionsQuery(args));
    }

    @ResolveField(() => UserNode)
    async user(@Parent() parent: UserPermissionNode): Promise<UserNode> {
        const user = await this.userLoader.byId.load(parent.userId);
        return plainToClass(UserNode, user);
    }

    @ResolveField(() => PermissionNode)
    async permission(@Parent() parent: UserPermissionNode): Promise<PermissionNode> {
        const permission = await this.permissionLoader.byId.load(parent.permissionId);
        return plainToClass(PermissionNode, permission);
    }

    @ResolveField(() => PermissionParameterNode)
    async parameter(@Parent() parent: UserPermissionNode): Promise<PermissionParameterNode> {
        const parameter = await this.parameterLoader.byId.load(parent.id);
        return plainToClass(PermissionParameterNode, parameter);
    }
}
