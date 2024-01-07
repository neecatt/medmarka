import { Injectable } from '@nestjs/common';
import { DbContext } from '../db-context';
import { RoleName } from '@modules/user/domain/enums/role-name';

@Injectable()
export class RolesSeeder {
    constructor(private readonly dbContext: DbContext) {}

    public async run(): Promise<any> {
        const objects = [
            { name: RoleName.Default },
            { name: RoleName.Patient },
            { name: RoleName.Manager },
            { name: RoleName.Doctor },
        ];

        const newObjects = [];

        for (const obj of objects) {
            const existObj = await this.dbContext.roles.findOne({ where: obj });

            if (existObj) continue;

            newObjects.push(this.dbContext.roles.create(obj));
        }

        await this.dbContext.roles.save(newObjects);
    }
}
