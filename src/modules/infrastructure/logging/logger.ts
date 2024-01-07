import { HttpException, Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class Logger {
    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService) {}

    error(error: HttpException | Error | string, context?: string): void {
        if (error instanceof String) {
            this.loggerService.error(error, undefined, context);
        } else if (error instanceof HttpException) {
            this.loggerService.error(`${error.message}\n${error.stack}`, error.stack, context);
        } else if (error instanceof Error) {
            this.loggerService.error(`${error.message}\n${error.stack}`, error.stack, context);
        }
    }

    warn(message: Record<string, any> | string, context?: string): void {
        this.loggerService.warn(message, context);
    }

    log(message: Record<string, any> | string, context?: string): void {
        this.loggerService.log(message, context);
    }

    verbose(message: Record<string, any> | string, context?: string): void {
        this.loggerService.verbose(message, context);
    }

    debug(message: Record<string, any> | string, context?: string): void {
        this.loggerService.debug(message, context);
    }
}
