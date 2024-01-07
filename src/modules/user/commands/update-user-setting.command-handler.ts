import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserSettingCommand } from './update-user-setting.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { UpdateUserSettingsPayload } from '@modules/user/graphql/types/update-user-settings-mutation-types';

@CommandHandler(UpdateUserSettingCommand)
export class UpdateUserSettingCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<UpdateUserSettingCommand>
{
    async execute({ userId, settingId, value }: UpdateUserSettingCommand): Promise<UpdateUserSettingsPayload> {
        const userSetting = await this.dbContext.userSettings.findOne({ where: { userId, settingId } });

        if (!userSetting) {
            throw new NotFoundException(ErrorCode.USER_SETTING_NOT_FOUND);
        }

        if (userSetting.value != value) {
            userSetting.value = value;
            await this.dbContext.userSettings.save(userSetting);
        }

        return { result: true };
    }
}
