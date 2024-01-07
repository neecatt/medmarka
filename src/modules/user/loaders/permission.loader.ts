import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Permission } from '../domain/models/permission.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class PermissionLoader extends BaseDataLoader {
    readonly byId = new DataLoader<string, Permission>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.permissions.findByIds(ids);

            return ids.map((id) => entities.find((e) => e.id === id) || new Error(`No Permission for ${id}`));
        } catch (error) {
            throw error;
        }
    });
}
