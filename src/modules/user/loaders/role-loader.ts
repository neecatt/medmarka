import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Role } from '../domain/models/role.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class RoleLoader extends BaseDataLoader {
    readonly byUserId = new DataLoader<string, Role[]>(async (userIds: string[]) => {
        try {
            const entities = await this.dbContext.userRoles.find({
                where: { userId: In(userIds) },
                relations: ['role', 'user'],
            });

            return userIds.map((userId) => {
                const roles = [];

                entities.map((ur) => ur.userId === userId && roles.push(ur.role));

                return roles;
            });
        } catch (error) {
            throw error;
        }
    });
}
