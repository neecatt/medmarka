import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { DbContext } from '../db-context';
import { SettingGroup } from '@modules/user/domain/models/setting-group.entity';
import { AllowedSettingValue } from '@modules/user/domain/models/allowed-setting-value';
import { SettingType } from '@modules/user/domain/enums/setting-type';
import { SettingScope } from '@modules/user/domain/enums/setting-scope';
import { SettingDataType } from '@modules/user/domain/enums/setting-data-type';

@Injectable()
export class SettingsSeeder {
    constructor(private readonly dbContext: DbContext) {}

    public async run(): Promise<any> {
        const settingGroups: DeepPartial<SettingGroup>[] = [
            {
                name: 'APPEARANCE',
                settings: [
                    {
                        type: SettingType.THEME,
                        scopes: [SettingScope.ALL],
                        required: true,
                        dataType: SettingDataType.STRING,
                        allowedValues: [
                            { label: 'LIGHT', value: 'light' },
                            { label: 'DARK', value: 'dark' },
                        ],
                    },
                    {
                        type: SettingType.LANGUAGE,
                        scopes: [SettingScope.ALL],
                        required: true,
                        dataType: SettingDataType.STRING,
                        allowedValues: [
                            { label: 'Azərbaycanca', value: 'az' },
                            { label: 'Русский', value: 'ru' },
                            { label: 'English', value: 'en' },
                        ],
                    },
                ],
            },
            {
                name: 'COMMUNICATION',
                settings: [],
            },
        ];

        const tasks = settingGroups.map(async ({ name, settings }) => {
            let settingGroup = await this.dbContext.settingGroups.findOne({
                where: { name },
                relations: ['settings'],
            });

            if (!settingGroup) {
                settingGroup = await this.dbContext.settingGroups.save({ name });
            }

            for (const { type, scopes, dataType, allowedValues, required } of settings) {
                const setting = await this.dbContext.settings.findOneBy({ type });

                if (setting) {
                    setting.scopes = scopes;
                    setting.dataType = dataType;
                    setting.allowedValues = allowedValues as AllowedSettingValue[];
                    setting.required = required;
                    await this.dbContext.settings.save(setting);
                } else {
                    await this.dbContext.settings.insert({
                        type,
                        scopes,
                        dataType,
                        allowedValues,
                        required,
                        groupId: settingGroup.id,
                    });
                }
            }
        });
        await Promise.all(tasks);
    }
}
