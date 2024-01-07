import path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {
    // NODE_ENV,
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_USER,
} from '@config/environment';

export const postgresConnectionOptions: PostgresConnectionOptions = {
    applicationName: 'Example app',
    type: 'postgres',
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    synchronize: false,
    logging: false, //false && NODE_ENV === 'development',
    migrationsRun: true,
    entities: [path.join(__dirname, '..', '**/domain/models/*.entity.{ts,js}')],
    migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
};
