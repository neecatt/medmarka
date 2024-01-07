import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { DbContext } from '../db-context';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE_NUMBER } from '@config/environment';
import { Gender } from '@modules/user/domain/enums/gender';
import { RoleName } from '@modules/user/domain/enums/role-name';

@Injectable()
export class UsersSeeder {
    constructor(private readonly dbContext: DbContext) {}

    public async run(): Promise<any> {
        const phoneNumber = ADMIN_PHONE_NUMBER;

        const existingUser = await this.dbContext.userDetails.findOne({ where: { phoneNumber } });

        if (!existingUser) {
            const role = await this.dbContext.roles.findOneBy({ name: RoleName.Manager });

            const email = ADMIN_EMAIL;
            const password = ADMIN_PASSWORD;
            const passwordHash = await hash(password, await genSalt(10));

            const users = [
                {
                    firstName: 'Super',
                    lastName: 'Admin',
                    email,
                    password: passwordHash,
                    emailVerified: true,
                },
            ];
            const tasks = users.map(async (u) => {
                const user = this.dbContext.users.create(u);

                await this.dbContext.users.save(user);

                const userDetails = this.dbContext.userDetails.create({
                    user,
                    gender: Gender.MALE,
                    dateOfBirth: new Date('01-01-2000'),
                    phoneNumber: '+994999999999',
                });
                await this.dbContext.userDetails.save(userDetails);

                const manager = this.dbContext.managers.create({ userId: user.id });

                await this.dbContext.managers.save(manager);

                const userRole = this.dbContext.userRoles.create({ roleId: role.id, userId: user.id });
                await this.dbContext.userRoles.save(userRole);
            });
            await Promise.all(tasks);
        }
    }
}
