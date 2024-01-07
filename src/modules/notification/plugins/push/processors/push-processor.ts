import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PushService } from '../services/push.service';
import { SendPushOptions } from '../types/send-push-options';
import { PUSH_QUEUE } from '@config/environment';
import { Logger } from '@modules/infrastructure/logging/logger';

@Processor(PUSH_QUEUE)
export class PushProcessor {
    constructor(private readonly pushService: PushService, private readonly logger: Logger) {}

    @Process()
    async send(job: Job<SendPushOptions>): Promise<any> {
        try {
            await this.pushService.sendNotifications(job.data);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
