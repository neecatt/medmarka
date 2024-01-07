import { DataSource } from 'typeorm';
import { postgresConnectionOptions } from './postgres-connection-options';

export default new DataSource(postgresConnectionOptions);
