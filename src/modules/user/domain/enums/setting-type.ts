import { registerEnumType } from '@nestjs/graphql';

export enum SettingType {
    THEME = 'THEME',
    LANGUAGE = 'LANGUAGE',
    RECEIVE_EMAIL_NOTIFICATIONS = 'RECEIVE_EMAIL_NOTIFICATIONS',
    RECEIVE_SMS_NOTIFICATIONS = 'RECEIVE_SMS_NOTIFICATIONS',
}

registerEnumType(SettingType, { name: 'SettingType' });
