import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { PermissionParameter } from '../domain/models/permission-parameter.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class PermissionParameterLoader extends BaseDataLoader {
    readonly byId = new DataLoader<string, PermissionParameter>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.permissionParameters.findByIds(ids);

            return ids.map((id) => entities.find((e) => e.id === id) || new Error(`No Permission Parameter for ${id}`));
        } catch (error) {
            throw error;
        }
    });

    readonly byPermissionId = new DataLoader<string, PermissionParameter[]>(async (permissionIds: string[]) => {
        try {
            const entities = await this.dbContext.permissionParameters.find({
                where: { permissionId: In(permissionIds) },
            });

            return permissionIds.map((permissionId) => entities.filter((e) => e.permissionId === permissionId));
        } catch (error) {
            throw error;
        }
    });
}
