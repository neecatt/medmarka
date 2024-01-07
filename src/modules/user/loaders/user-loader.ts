import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { User } from '@modules/user/domain/models/user.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class UserLoader extends BaseDataLoader {
    readonly byId = new DataLoader<string, User>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.users.find({ where: { id: In(ids) }, withDeleted: true });

            return ids.map((id) => entities.find((e) => e.id === id) || new Error(`No ${User.name} for ${id}`));
        } catch (error) {
            throw error;
        }
    });
}
