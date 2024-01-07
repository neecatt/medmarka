import { ChannelType } from './channel-type';
import {
    EmailTemplateContext,
    PushTemplateContext,
    TelegramTemplateContext,
    WebPushTemplateContext,
} from './template-context';
import { SettingType } from '@modules/user/domain/enums/setting-type';

type EmailChannelConfig = {
    channel: ChannelType.EMAIL;
    to?: { email: string | string[] };
    context: EmailTemplateContext;
};

type PushChannelConfig = {
    channel: ChannelType.PUSH;
    to?: { pushTokens: string[] };
    context: PushTemplateContext;
};

type WebPushChannelConfig = {
    channel: ChannelType.WEB_PUSH;
    to?: { webPushTokens: string[] };
    context: WebPushTemplateContext;
};

type TelegramChannelConfig = {
    channel: ChannelType.TELEGRAM;
    to?: { chatId: string };
    context: TelegramTemplateContext;
};

export type ChannelConfig = (EmailChannelConfig | PushChannelConfig | WebPushChannelConfig | TelegramChannelConfig) & {
    settingType?: SettingType;
};
