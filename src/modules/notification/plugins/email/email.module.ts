import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailProcessor } from './processors/mail-processor';
import { EMAIL_QUEUE, REDIS_HOST, REDIS_PORT, REDIS_PREFIX, SMTP_CONNECTION_URL } from '@config/environment';

const processors = [MailProcessor];

const providers = [...processors];

const imports = [
    BullModule.registerQueue({
        name: EMAIL_QUEUE,
        redis: {
            host: REDIS_HOST,
            port: REDIS_PORT,
        },
        prefix: `${REDIS_PREFIX}bull`,
    }),
    NestMailerModule.forRoot({
        transport: {
            host: SMTP_CONNECTION_URL,
            port: 465,
            secure: true,
            from: 'medmarka.api@gmail.com',
            auth: {
                user: 'medmarka.api@gmail.com',
                pass: 'sdhzszzzpermcfik',
            },
        },
    }),
];

@Module({
    imports,
    providers,
    exports: [BullModule],
})
export class EmailModule {}
