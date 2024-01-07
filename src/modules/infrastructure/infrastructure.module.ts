import { Global, Module } from '@nestjs/common';
import { Logger } from './logging/logger';

@Global()
@Module({
    providers: [Logger],
    exports: [Logger],
})
export class InfrastructureModule {}
