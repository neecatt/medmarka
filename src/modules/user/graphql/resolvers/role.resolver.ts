import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { RoleConnection, RoleNode } from '../types/connection-types/role-connection-types';
import {
    RolePermissionConnection,
    RolePermissionNode,
} from '../types/connection-types/role-permission-connection-types';
import { CreateRoleInput, CreateRolePayload } from '../types/create-role-mutation-types';
import { DeleteRolePayload } from '../types/delete-role-payload';
import { UpdateRoleInput, UpdateRolePayload } from '../types/update-role-mutation-types';
import { AuthorizePermissions } from '@modules/auth/decorators/authorize-permission.decorator';
import { getConnectionFromArray } from '@modules/shared/graphql/relay';
import { CreateRoleCommand } from '@modules/user/commands/role/create-role.command';
import { DeleteRoleCommand } from '@modules/user/commands/role/delete-role.command';
import { UpdateRoleCommand } from '@modules/user/commands/role/update-role.command';
import { PermissionName } from '@modules/user/domain/enums/permission-name';
import { RolePermissionloader } from '@modules/user/loaders/role-permission.loader';
import { GetAllRolesQuery } from '@modules/user/queries/role/get-all-roles.query';
import { GetRoleQuery } from '@modules/user/queries/role/get-role.query';

@Resolver(() => RoleNode)
export class RoleResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly rolePermissionloader: RolePermissionloader,
    ) {}

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => RoleConnection, { nullable: true })
    async roles(): Promise<RoleConnection> {
        return await this.queryBus.execute(new GetAllRolesQuery());
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => RoleNode, { nullable: true })
    async role(@Args('id') id: string): Promise<RoleNode> {
        return await this.queryBus.execute(new GetRoleQuery(id));
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_CREATE)
    @Mutation(() => CreateRolePayload)
    async createRole(@Args('input') input: CreateRoleInput): Promise<CreateRolePayload> {
        const command = plainToClass(CreateRoleCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_UPDATE)
    @Mutation(() => UpdateRolePayload)
    async updateRole(@Args('input') input: UpdateRoleInput): Promise<UpdateRolePayload> {
        const command = plainToClass(UpdateRoleCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_DELETE)
    @Mutation(() => DeleteRolePayload)
    async deleteRole(@Args('id') id: string): Promise<DeleteRolePayload> {
        const command = new DeleteRoleCommand(id);
        return await this.commandBus.execute(command);
    }

    @ResolveField(() => RolePermissionConnection, { nullable: true })
    async rolePermissions(@Parent() role: RoleNode): Promise<RolePermissionConnection> {
        const rolePermissions = await this.rolePermissionloader.byRoleId.load(role.id);
        return getConnectionFromArray(rolePermissions, RolePermissionNode);
    }
}
