import { registerEnumType } from '@nestjs/graphql';

export enum ChannelType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    TELEGRAM = 'TELEGRAM',
    PUSH = 'PUSH',
    WEB_PUSH = 'WEB_PUSH',
}

registerEnumType(ChannelType, { name: 'ChannelType' });
