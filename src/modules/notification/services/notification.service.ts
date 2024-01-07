import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import { SendMailOptions } from 'nodemailer';
import { SendPushOptions } from '../plugins/push/types/send-push-options';
import { SendWebPushOptions } from '../plugins/web-push/types/send-web-push-options';
import { ChannelType } from '../types/channel-type';
import { NotificationOptions } from '../types/notification-options';
import { SendTelegramMessageOptions } from '../plugins/telegram/types/send-telegram-message-options';
import { DevicePlatform } from '@modules/user/domain/enums/device-platform';
import { TemplateService } from '@modules/notification/services/template.service';
import { Logger } from '@modules/infrastructure/logging/logger';
import { DbContext } from '@modules/db/db-context';
import { EMAIL_QUEUE, PUSH_QUEUE, TELEGRAM_QUEUE, WEB_PUSH_QUEUE } from '@config/environment';
import { SettingType } from '@modules/user/domain/enums/setting-type';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

type UserNotificationSettings = {
    email?: string;
    webPushTokens: string[];
    pushTokens: string[];
    settings: { type: SettingType; value: string }[];
};

@Injectable()
export class NotificationService {
    constructor(
        @InjectQueue(PUSH_QUEUE) private readonly pushQueue: Queue,
        @InjectQueue(WEB_PUSH_QUEUE) private readonly webPushQueue: Queue,
        @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
        @InjectQueue(TELEGRAM_QUEUE) private readonly telegramQueue: Queue,
        private readonly templateService: TemplateService,
        private readonly dbContext: DbContext,
        private readonly logger: Logger,
    ) {}

    async send(notificationOptions: NotificationOptions, opts?: JobOptions): Promise<void> {
        const { templateName, channelConfigs } = notificationOptions;

        for (const channelConfig of channelConfigs) {
            const { context, channel, to } = channelConfig;

            switch (channel) {
                case ChannelType.EMAIL:
                    const body = this.templateService.compileTemplate(templateName, context, 'email');

                    try {
                        const emailOptions: SendMailOptions = {
                            from: { name: 'Example-app', address: 'noreply@example-app.com' },
                            to: to.email,
                            subject: context.SUBJECT,
                            html: body,
                            attachments: context.ATTACHMENTS,
                        };

                        await this.emailQueue.add(emailOptions, opts);
                    } catch (error) {
                        this.logger.error(error);
                    }
                    break;

                case ChannelType.PUSH:
                    try {
                        const body = this.templateService.compileTemplate(templateName, context, 'push');

                        const pushOptions: SendPushOptions = {
                            title: context.TITLE,
                            subtitle: context.SUBTITLE,
                            data: context.DATA, //MUST BE JSON
                            body,
                            pushTokens: to.pushTokens,
                        };

                        await this.pushQueue.add(pushOptions, opts);
                    } catch (error) {
                        this.logger.error(error);
                    }
                    break;

                case ChannelType.WEB_PUSH:
                    try {
                        const body = this.templateService.compileTemplate(templateName, context, 'web-push');

                        const webPushOptions: SendWebPushOptions = {
                            title: context.TITLE,
                            data: context.DATA, //MUST BE JSON
                            body,
                            webPushTokens: to.webPushTokens,
                        };

                        await this.webPushQueue.add(webPushOptions, opts);
                    } catch (error) {
                        this.logger.error(error);
                    }
                    break;

                case ChannelType.TELEGRAM:
                    try {
                        const body = this.templateService.compileTemplate(templateName, context, 'telegram');

                        const telegramMessageOptions: SendTelegramMessageOptions = {
                            chatId: to.chatId,
                            text: body,
                        };

                        await this.telegramQueue.add(telegramMessageOptions, opts);
                    } catch (error) {
                        this.logger.error(error);
                    }
                    break;
            }
        }
    }

    async sendToUser(userId: string, notificationOptions: NotificationOptions, opts?: JobOptions): Promise<void> {
        const user = await this.getUserNotificationSettings(userId);

        notificationOptions.channelConfigs = notificationOptions.channelConfigs.filter((channelConfig) => {
            const { settingType } = channelConfig;
            let shouldSend = !settingType || user.settings.find((s) => s.type === settingType)?.value === 'true';

            switch (channelConfig.channel) {
                case ChannelType.EMAIL:
                    if (!user.email) {
                        shouldSend = false;
                    }
                    break;

                case ChannelType.PUSH:
                    if (!user.pushTokens.length) {
                        shouldSend = false;
                    }
                    break;

                case ChannelType.WEB_PUSH:
                    if (!user.webPushTokens.length) {
                        shouldSend = false;
                    }
                    break;
            }

            return shouldSend;
        });

        for (const channelConfig of notificationOptions.channelConfigs) {
            switch (channelConfig.channel) {
                case ChannelType.EMAIL:
                    channelConfig.to = { email: user.email };
                    break;

                case ChannelType.PUSH:
                    channelConfig.to = { pushTokens: user.pushTokens };
                    break;

                case ChannelType.WEB_PUSH:
                    channelConfig.to = { webPushTokens: user.webPushTokens };
                    break;
            }
        }

        await this.send(notificationOptions, opts);
    }

    async getUserNotificationSettings(userId: string): Promise<UserNotificationSettings> {
        const user = await this.dbContext.users.findOne({
            where: { id: userId },
            relations: {
                devices: true,
                settings: {
                    setting: true,
                },
            },
        });

        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const data = { email: user.email, webPushTokens: [], pushTokens: [] } as UserNotificationSettings;

        data.settings = user.settings.map((us) => ({ type: us.setting.type, value: us.value }));

        user.devices.filter((d) => {
            if (d.platform == DevicePlatform.WEB) {
                data.webPushTokens.push(d.pushToken);
            } else {
                data.pushTokens.push(d.pushToken);
            }
        });

        return data;
    }
}
