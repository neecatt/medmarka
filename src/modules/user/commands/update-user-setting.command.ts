import { Expose } from 'class-transformer';

export class UpdateUserSettingCommand {
    userId: string;

    @Expose()
    settingId: string;

    @Expose()
    value: string;
}
