import { Inject, Injectable } from '@nestjs/common';
import { In, Not } from 'typeorm';
import { RoleName } from '../domain/enums/role-name';
import { Role } from '../domain/models/role.entity';
import { UserPermission } from '../domain/models/user-permission.entity';
import { User } from '@modules/user/domain/models/user.entity';
import { DbContext } from '@modules/db/db-context';

@Injectable()
export class PermissionService {
    @Inject() private readonly dbContext: DbContext;

    public async assignRolePermissionsToUser(
        { id: userId, userPermissions, userRoles }: Partial<User>,
        roles: Role[],
    ): Promise<void> {
        const newUserPermissions: UserPermission[] = [];

        if (userPermissions?.length) {
            await this.dbContext.userPermissions.remove(userPermissions);

            if (userRoles?.length) {
                await this.dbContext.userRoles.remove(userRoles);
            }
        }

        for (const role of roles) {
            role.rolePermissions.map(({ parameterId, permissionId }) => {
                let isSame = false;

                newUserPermissions.forEach((up) => {
                    if (up.permissionId === permissionId) isSame = true;
                });

                if (!isSame) {
                    const newObj = this.dbContext.userPermissions.create({ parameterId, permissionId, userId });
                    newUserPermissions.push(newObj);
                }
            });
        }

        await this.dbContext.userPermissions.save(newUserPermissions);
    }

    public async findRoles(roleIds: string[], name?: RoleName): Promise<Role[]> {
        let roles: Role[] = [];

        const defaultRole = await this.dbContext.roles.findOne({
            where: { name: RoleName.Default },
            relations: ['rolePermissions'],
        });

        const permittedRoles: RoleName[] = [RoleName.Default, RoleName.Doctor, RoleName.Patient];

        roles = await this.dbContext.roles.find({
            where: {
                ...(roleIds.length ? { id: In(roleIds) } : { name }),
                name: Not(In(permittedRoles)),
            },
            relations: ['rolePermissions'],
        });

        return [...roles, defaultRole];
    }
}
