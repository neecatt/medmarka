import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { UserSettingConnection, UserSettingNode } from '../types/user-setting-connection-types';
import { UpdateUserSettingsInput, UpdateUserSettingsPayload } from '../types/update-user-settings-mutation-types';
import { UpdateUserSettingInput } from '../types/update-user-setting-input';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { AuthorizeUser } from '@modules/auth/decorators/authorize-user.decorator';
import { GetAllSelectedSettingsQuery } from '@modules/user/queries/get-all-selected-settings.query';
import { UpdateUserSettingsCommand } from '@modules/user/commands/update-user-settings.command';
import { UpdateUserSettingCommand } from '@modules/user/commands/update-user-setting.command';

@Resolver(() => UserSettingNode)
export class UserSettingResolver {
    constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}
    @AuthorizeUser()
    @Query(() => UserSettingConnection)
    async selectedSettings(@CurrentUser('id') userId: string): Promise<UserSettingConnection> {
        const query = new GetAllSelectedSettingsQuery(userId);
        return await this.queryBus.execute(query);
    }

    @AuthorizeUser()
    @Mutation(() => UpdateUserSettingsPayload)
    async updateUserSettings(
        @Args('input') input: UpdateUserSettingsInput,
        @CurrentUser('id') userId: string,
    ): Promise<UpdateUserSettingsPayload> {
        const command = plainToClass(UpdateUserSettingsCommand, input, { excludeExtraneousValues: true });
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @AuthorizeUser()
    @Mutation(() => UpdateUserSettingsPayload)
    async updateUserSetting(
        @Args('input') input: UpdateUserSettingInput,
        @CurrentUser('id') userId: string,
    ): Promise<UpdateUserSettingsPayload> {
        const command = plainToClass(UpdateUserSettingCommand, input, { excludeExtraneousValues: true });
        command.userId = userId;
        return await this.commandBus.execute(command);
    }
}
