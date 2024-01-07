import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Gender } from '../domain/enums/gender';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class UserDetailLoader extends BaseDataLoader {
    readonly fullnameByUserId = new DataLoader<string, string>(async (userIds: string[]) => {
        try {
            const entities = await this.dbContext.userDetails.find({
                where: { userId: In(userIds) },
                relations: ['user'],
                withDeleted: true,
            });

            return userIds.map((userId) => {
                const userDetail = entities.find((u) => u.userId === userId);

                if (!userDetail) {
                    return new Error(`No User for ${userId}`);
                }

                return userDetail.user.firstName + ' ' + userDetail.user.lastName;
            });
        } catch (error) {
            throw error;
        }
    });

    readonly bioByUserId = new DataLoader<string, string>(async (userIds: string[]) => {
        try {
            const entities = await this.dbContext.userDetails.find({
                where: { userId: In(userIds) },
            });

            return userIds.map((userId) => {
                const userDetail = entities.find((userD) => userD.userId === userId);

                if (!userDetail) {
                    return new Error(`No User for ${userId}`);
                }

                return userDetail.bio;
            });
        } catch (error) {
            throw error;
        }
    });

    readonly phoneNumberByUserId = new DataLoader<string, string>(async (userIds: string[]) => {
        try {
            const entities = await this.dbContext.userDetails.find({
                where: { userId: In(userIds) },
                relations: ['user'],
            });

            return userIds.map((userId) => {
                const userDetail = entities.find((userD) => userD.userId === userId);

                if (!userDetail) {
                    return new Error(`No User for ${userId}`);
                }

                return userDetail.phoneNumber;
            });
        } catch (error) {
            throw error;
        }
    });

    readonly addressByUserId = new DataLoader<string, string>(async (userIds: string[]) => {
        try {
            const entities = await this.dbContext.userDetails.find({
                where: { userId: In(userIds) },
            });

            return userIds.map((userId) => {
                const userDetail = entities.find((userD) => userD.userId === userId);

                if (!userDetail) {
                    return new Error(`No User for ${userId}`);
                }

                return userDetail.address;
            });
        } catch (error) {
            throw error;
        }
    });

    readonly dateOfBirthdayByUserId = new DataLoader<string, Date>(async (userIds: string[]) => {
        try {
            const entities = await this.dbContext.userDetails.find({
                where: { userId: In(userIds) },
            });

            return userIds.map((userId) => {
                const userDetail = entities.find((userD) => userD.userId === userId);

                if (!userDetail) {
                    return new Error(`No User for ${userId}`);
                }

                return userDetail.dateOfBirth;
            });
        } catch (error) {
            throw error;
        }
    });

    readonly genderByUserId = new DataLoader<string, Gender>(async (userIds: string[]) => {
        try {
            const entities = await this.dbContext.userDetails.find({
                where: { userId: In(userIds) },
            });

            return userIds.map((userId) => {
                const userDetail = entities.find((userD) => userD.userId === userId);

                if (!userDetail) {
                    return new Error(`No User for ${userId}`);
                }
                return userDetail.gender;
            });
        } catch (error) {
            throw error;
        }
    });

    readonly lastLoginByUserId = new DataLoader<string, Date>(async (userIds: string[]) => {
        try {
            const entities = await this.dbContext.userDetails.find({
                where: { userId: In(userIds) },
            });

            return userIds.map((userId) => {
                const userDetail = entities.find((userD) => userD.userId === userId);

                if (!userDetail) {
                    return new Error(`No User for ${userId}`);
                }

                return userDetail.lastLogin;
            });
        } catch (error) {
            throw error;
        }
    });
}
