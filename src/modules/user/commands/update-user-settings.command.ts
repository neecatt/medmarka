import { Expose } from 'class-transformer';
import { UpdateUserSettingInput } from '@modules/user/graphql/types/update-user-setting-input';

export class UpdateUserSettingsCommand {
    @Expose()
    userId: string;

    @Expose()
    settings: UpdateUserSettingInput[];
}
