import { Inject, Injectable } from '@nestjs/common';
import { Telegram } from 'telegraf';
import { SendTelegramMessageOptions } from '../types/send-telegram-message-options';

@Injectable()
export class TelegramService {
    constructor(@Inject('TELEGRAM_EXAMPLE_APP_DEV_BOT') private readonly telegram: Telegram) {}

    async sendMessage(telegramMessageOptions: SendTelegramMessageOptions): Promise<void> {
        const { chatId, text } = telegramMessageOptions;

        await this.telegram.sendMessage(chatId, text, { parse_mode: 'MarkdownV2' });
    }
}
