import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { Telegram } from 'telegraf';
import { TelegramProcessor } from './processors/telegram-processor';
import { TelegramService } from './services/telegram.service';
import {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PREFIX,
    TELEGRAM_EXAMPLE_APP_DEV_BOT_TOKEN,
    TELEGRAM_QUEUE,
} from '@config/environment';

const processors = [TelegramProcessor];

const services = [TelegramService];

const providers = [...processors, ...services];

const imports = [
    BullModule.registerQueue({
        name: TELEGRAM_QUEUE,
        redis: {
            host: REDIS_HOST,
            port: REDIS_PORT,
        },
        prefix: `${REDIS_PREFIX}bull`,
    }),
];

@Module({
    imports,
    providers: [
        ...providers,
        { provide: 'TELEGRAM_EXAMPLE_APP_DEV_BOT', useValue: new Telegram(TELEGRAM_EXAMPLE_APP_DEV_BOT_TOKEN) },
    ],
    exports: [BullModule],
})
export class TelegramModule {}
