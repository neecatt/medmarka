import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TelegramService } from '../services/telegram.service';
import { SendTelegramMessageOptions } from '../types/send-telegram-message-options';
import { TELEGRAM_QUEUE } from '@config/environment';
import { Logger } from '@modules/infrastructure/logging/logger';

@Processor(TELEGRAM_QUEUE)
export class TelegramProcessor {
    constructor(private readonly telegramService: TelegramService, private readonly logger: Logger) {}

    @Process()
    async send(job: Job<SendTelegramMessageOptions>): Promise<any> {
        try {
            await this.telegramService.sendMessage(job.data);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
