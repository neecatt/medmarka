import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { NODE_ENV } from '@config/environment';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {}

    catch(exception: HttpException, host: ArgumentsHost): any {
        if (NODE_ENV === 'development') {
            this.logger.error(exception.message, exception.stack, exception.name);
        }

        if (host.getType<GqlContextType>() === 'graphql' || host.getType<GqlContextType>() === 'ws') {
            return exception;
        }

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        response.code(status).send({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url || request.raw.url,
            message: exception.message,
        });
    }
}
