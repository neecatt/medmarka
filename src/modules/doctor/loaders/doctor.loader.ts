import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Doctor } from '../domain/models/doctor.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class DoctorLoader extends BaseDataLoader {
    readonly byUserId = new DataLoader<string, Doctor>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.doctors.find({ where: { userId: In(ids) } });
            return ids.map((id) => entities.find((e) => e.userId === id));
        } catch (error) {
            throw error;
        }
    });
}
