import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { WebPushProcessor } from './processors/web-push-processor';
import { WebPushService } from './services/web-push.service';
import { REDIS_HOST, REDIS_PORT, REDIS_PREFIX, WEB_PUSH_QUEUE } from '@config/environment';

const processors = [WebPushProcessor];

const services = [WebPushService];

const providers = [...processors, ...services];

const imports = [
    BullModule.registerQueue({
        name: WEB_PUSH_QUEUE,
        redis: {
            host: REDIS_HOST,
            port: REDIS_PORT,
        },
        prefix: `${REDIS_PREFIX}bull`,
    }),
];

@Module({
    imports,
    providers,
    exports: [BullModule],
})
export class WebPushModule {}
