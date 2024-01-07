import { Injectable } from '@nestjs/common';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { SendPushOptions } from '../types/send-push-options';
import { Logger } from '@modules/infrastructure/logging/logger';

@Injectable()
export class PushService {
    private readonly expo: Expo;

    constructor(private readonly logger: Logger) {
        this.expo = new Expo();
    }

    async sendNotifications(pushOptions: SendPushOptions): Promise<void> {
        const { pushTokens, ...expoPushMessage } = pushOptions;

        const messages: ExpoPushMessage[] = [];

        for (const pushToken of pushTokens) {
            if (!Expo.isExpoPushToken(pushToken)) {
                this.logger.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            const message: ExpoPushMessage = {
                ...expoPushMessage,
                to: pushToken,
                sound: 'default',
                channelId: 'notifications',
            };

            messages.push(message);
        }

        await this.sendMessages(messages);
    }

    private async sendMessages(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]> {
        const chunks = this.expo.chunkPushNotifications(messages);

        const tickets: ExpoPushTicket[] = [];

        try {
            for (const chunk of chunks) {
                const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            }
        } catch (error) {
            this.logger.error(error);
        }

        return tickets;
    }
}
