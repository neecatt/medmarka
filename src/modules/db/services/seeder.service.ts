import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { RolesSeeder, SettingsSeeder, UsersSeeder } from '../seeders';
import { Logger } from '@modules/infrastructure/logging/logger';

@Injectable()
export class SeederService {
    constructor(
        private readonly logger: Logger,
        private readonly rolesSeeder: RolesSeeder,
        private readonly usersSeeder: UsersSeeder,
        private readonly settingsSeeder: SettingsSeeder,
    ) {}

    @Transactional()
    async runSeedsAsync(): Promise<void> {
        this.logger.log('Running seeders ...', 'Database');
        await this.rolesSeeder.run();
        await this.usersSeeder.run();
        await this.settingsSeeder.run();
        this.logger.log('Finished running seeders', 'Database');
    }
}
