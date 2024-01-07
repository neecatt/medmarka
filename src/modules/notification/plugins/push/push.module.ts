import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PushProcessor } from './processors/push-processor';
import { PushService } from './services/push.service';
import { PUSH_QUEUE, REDIS_HOST, REDIS_PORT, REDIS_PREFIX } from '@config/environment';

const processors = [PushProcessor];

const services = [PushService];

const providers = [...processors, ...services];

const imports = [
    BullModule.registerQueue({
        name: PUSH_QUEUE,
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
export class PushModule {}
