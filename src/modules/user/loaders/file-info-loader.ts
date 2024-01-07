import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { FileInfo } from '@modules/file/domain/models/file-info.entity';
import { DbContext } from '@modules/db/db-context';

@Injectable({ scope: Scope.REQUEST })
export class FileInfoLoader {
    constructor(private readonly dbContext: DbContext) {}

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
