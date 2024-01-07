import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { RolePermission } from '../domain/models/role-permission.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class RolePermissionloader extends BaseDataLoader {
    readonly byRoleId = new DataLoader<string, RolePermission[]>(async (roleIds: string[]) => {
        try {
            const entities: RolePermission[] = await this.dbContext.rolePermissions.find({
                where: { roleId: In(roleIds) },
                relations: ['role', 'permission'],
            });

            return roleIds.map((roleId) => entities.filter((e) => e.roleId === roleId));
        } catch (error) {
            throw error;
        }
    });
}
