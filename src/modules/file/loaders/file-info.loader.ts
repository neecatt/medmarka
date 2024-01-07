import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { FileInfo } from '../domain/models/file-info.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class FileInfoLoader extends BaseDataLoader {
    readonly byId = new DataLoader<string, FileInfo>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.fileInfos.findByIds(ids);
            return ids.map((id) => entities.find((e) => e.id === id) || new Error(`No ${FileInfo} for ${id}`));
        } catch (error) {
            throw error;
        }
    });

    readonly avatarByUserId = new DataLoader<string, FileInfo>(async (userIds: string[]) => {
        try {
            const entities = await this.dbContext.userDetails.find({
                where: { userId: In(userIds) },
                relations: ['user', 'avatar'],
            });

            return userIds.map((userId) => {
                const userDetail = entities.find((ud) => ud.userId === userId);

                if (!userDetail) {
                    return new Error(`No User for ${userId}`);
                }

                if (userDetail.avatar) {
                    return userDetail.avatar;
                } else {
                    return null;
                }
            });
        } catch (error) {
            throw error;
        }
    });
}
