import path from 'path';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import invariant from 'invariant';
import patchMethod from 'patch-method';
import { TransformOperationExecutor } from 'class-transformer/TransformOperationExecutor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import FastifyAltair from 'altair-fastify-plugin';
import FastifyGraphQLUpload from 'mercurius-upload';
import FastifyStatic from 'fastify-static';
import { renderVoyagerPage } from 'graphql-voyager/middleware';
import 'module-alias/register';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { FastifyAdapter as BullBoardFastifyAdapter } from '@bull-board/fastify';
import Queue from 'bull';
import { AppModule } from './app.module';
import { bootstrap } from './bootstrap';
import {
    APP_ENV,
    EMAIL_QUEUE,
    PORT,
    PUSH_QUEUE,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PREFIX,
    TELEGRAM_QUEUE,
    WEB_PUSH_QUEUE,
} from '@config/environment';
import { SeederService } from '@modules/db/services/seeder.service';
import { AllExceptionsFilter } from '@modules/infrastructure/filters/all-exceptions.filter';

async function startup(): Promise<void> {
    initializeTransactionalContext(); // Initialize cls-hooked

    // FIXME: Workaround until: https://github.com/typestack/class-transformer/pull/262
    invariant(
        /* eslint-disable @typescript-eslint/no-var-requires */
        require('class-transformer/package.json').version === '0.3.1',
        'Patched method assumes exact dependency version',
    );
    patchMethod(
        TransformOperationExecutor,
        'transform',
        (transform, source, value: any, targetType, arrayType, isMap, level = 0) => {
            if (value && typeof value === 'object' && typeof value.then === 'function') {
                return value;
            }

            return transform(source, value, targetType, arrayType, isMap, level);
        },
    );

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(logger);

    app.useGlobalFilters(new AllExceptionsFilter(logger));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.register(FastifyGraphQLUpload);
    app.register((fastify, opts, next) => {
        fastify.register(FastifyStatic, {
            root: path.join(__dirname, './static'),
        });
        next();
    });

    if (APP_ENV !== 'production') {
        const options = new DocumentBuilder().setTitle('Example-app').setVersion('1.0').addBearerAuth().build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('/swagger', app, document);

        app.register((fastify, opts, next) => {
            fastify.register(FastifyAltair, {
                path: '/altair',
                baseURL: '/altair/',
            });
            next();
        });

        app.register((fastify, opts, next) => {
            fastify.get('/voyager', (_, reply) => {
                reply
                    .code(200)
                    .header('Content-Type', 'text/html')
                    .send(
                        renderVoyagerPage({
                            endpointUrl: '/graphql',
                        }),
                    );
            });
            next();
        });
    }

    // Bull dashboard
    const queueOptions = {
        redis: {
            host: REDIS_HOST,
            port: REDIS_PORT,
        },
        prefix: `${REDIS_PREFIX}bull`,
    };

    const enabledQueueNames = [EMAIL_QUEUE, TELEGRAM_QUEUE, PUSH_QUEUE, WEB_PUSH_QUEUE];
    const queues = enabledQueueNames.map((queue) => new BullAdapter(new Queue(queue, queueOptions)));

    const serverAdapter = new BullBoardFastifyAdapter();

    createBullBoard({
        queues,
        serverAdapter,
    });

    serverAdapter.setBasePath('/bull');
    app.register(serverAdapter.registerPlugin(), { basePath: '/bull', prefix: '/bull' });

    // Bull dashboard

    const dbSeeder = app.get<SeederService>(SeederService);
    await dbSeeder.runSeedsAsync();

    const port = PORT || 3000;
    const address = '0.0.0.0';

    await app.listen(port, address, (err, address) => {
        if (err) {
            console.error(err);
        } else {
            console.table([
                { service: 'GraphQL Studio', url: `${address.replace('0.0.0.0', 'localhost')}/graphql` },
                { service: 'GraphQL Altair', url: `${address}/altair` },
                { service: 'GraphQL Voyager', url: `${address}/voyager` },
                { service: 'Swagger UI', url: `${address}/swagger` },
                { service: 'Bull Dashboard', url: `${address}/bull` },
            ]);
        }
    });
}

bootstrap(startup);
