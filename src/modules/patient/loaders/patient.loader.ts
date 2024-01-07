import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';
import { Patient } from '@modules/patient/domain/models/patient.entity';

@Injectable({ scope: Scope.REQUEST })
export class PatientLoader extends BaseDataLoader {
    readonly byId = new DataLoader<string, Patient>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.patients.find({ where: { id: In(ids) } });

            return ids.map((id) => entities.find((e) => e.id === id));
        } catch (error) {
            throw error;
        }
    });

    readonly byUserId = new DataLoader<string, Patient>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.patients.find({ where: { userId: In(ids) } });

            const patient = ids.map((id) => entities.find((e) => e.userId === id));
            return patient;
        } catch (error) {
            throw error;
        }
    });
}
