import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { DeleteManagersInput } from '../types/delete-managers-mutation-types';
import { ManagerConnectionArgs } from '../types/manager-connection-args';
import { ManagerConnection, ManagerNode } from '../types/manager-connection-types';
import {
    UpdateManagerByAdminInput,
    UpdateManagerByAdminPayload,
} from '../types/update-manager-by-admin-mutation-types';
import { UpdateManagerInput, UpdateManagerPayload } from '../types/update-manager-mutation-types';
import { AuthorizePermissions } from '@modules/auth/decorators/authorize-permission.decorator';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { DeleteManagersCommand } from '@modules/manager/commands/delete-managers.command';
import { UpdateManagerByAdminCommand } from '@modules/manager/commands/update-manager-by-admin.command';
import { UpdateManagerCommand } from '@modules/manager/commands/update-manager.command';
import { GetAllManagersQuery } from '@modules/manager/queries/get-all-managers.query';
import { GetManagerQuery } from '@modules/manager/queries/get-manager.query';
import { PermissionName } from '@modules/user/domain/enums/permission-name';
import { UserNode } from '@modules/user/graphql/types/connection-types/user-connection-types';
import { UserLoader } from '@modules/user/loaders/user-loader';
import { AuthorizeManager } from '@modules/auth/decorators/authorize-manager.decorator';

@Resolver(() => ManagerNode)
export class ManagerResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly userLoader: UserLoader,
    ) {}

    @AuthorizeManager()
    @Mutation(() => UpdateManagerPayload)
    async updateManager(
        @Args('manager') input: UpdateManagerInput,
        @CurrentUser('id') userId: string,
    ): Promise<UpdateManagerPayload> {
        const command = plainToClass(UpdateManagerCommand, input, { excludeExtraneousValues: true });
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_UPDATE)
    @Mutation(() => UpdateManagerByAdminPayload)
    async updateManagerByAdmin(
        @Args('manager') input: UpdateManagerByAdminInput,
    ): Promise<UpdateManagerByAdminPayload> {
        const command = plainToClass(UpdateManagerByAdminCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_DELETE)
    @Mutation(() => Boolean)
    async deleteManagers(@Args('input') input: DeleteManagersInput): Promise<boolean> {
        return await this.commandBus.execute(new DeleteManagersCommand(input.ids));
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => ManagerNode)
    async manager(@Args('id') id: string): Promise<ManagerNode> {
        return await this.queryBus.execute(new GetManagerQuery(id));
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => ManagerConnection)
    async managers(@Args() args: ManagerConnectionArgs): Promise<ManagerConnection> {
        return await this.queryBus.execute(new GetAllManagersQuery(args));
    }

    @ResolveField(() => UserNode)
    async user(@Parent() manager: ManagerNode): Promise<UserNode> {
        const user = await this.userLoader.byId.load(manager.userId);
        return plainToClass(UserNode, user);
    }
}
