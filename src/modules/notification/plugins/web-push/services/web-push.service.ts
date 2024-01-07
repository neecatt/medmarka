import { Injectable } from '@nestjs/common';
import webPush from 'web-push';
import { setVapidDetails } from '../static/web-push-config';
import { SendWebPushOptions } from '../types/send-web-push-options';
import { Logger } from '@modules/infrastructure/logging/logger';

@Injectable()
export class WebPushService {
    constructor(private readonly logger: Logger) {}

    async sendNotifications(webPushOptions: SendWebPushOptions): Promise<void> {
        const { title, body, webPushTokens } = webPushOptions;

        webPush.setVapidDetails(setVapidDetails.subject, setVapidDetails.publicKey, setVapidDetails.privateKey);

        const message = {
            notification: {
                title,
                body,
            },
        };

        if (webPushOptions?.data) {
            message.notification['data'] = webPushOptions.data;
        }

        try {
            for (const subscriber of webPushTokens) {
                await webPush.sendNotification(JSON.parse(subscriber), JSON.stringify(message));
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}
