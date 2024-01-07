import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WebPushService } from '../services/web-push.service';
import { SendWebPushOptions } from '../types/send-web-push-options';
import { WEB_PUSH_QUEUE } from '@config/environment';
import { Logger } from '@modules/infrastructure/logging/logger';

@Processor(WEB_PUSH_QUEUE)
export class WebPushProcessor {
    constructor(private readonly webPushService: WebPushService, private readonly logger: Logger) {}

    @Process()
    async send(job: Job<SendWebPushOptions>): Promise<any> {
        try {
            await this.webPushService.sendNotifications(job.data);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
