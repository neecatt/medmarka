import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EMAIL_QUEUE } from '@config/environment';
import { Logger } from '@modules/infrastructure/logging/logger';

@Processor(EMAIL_QUEUE)
export class MailProcessor {
    constructor(private readonly mailerService: MailerService, private readonly logger: Logger) {}

    @Process()
    async send(job: Job<ISendMailOptions>): Promise<any> {
        try {
            await this.mailerService.sendMail(job.data);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
