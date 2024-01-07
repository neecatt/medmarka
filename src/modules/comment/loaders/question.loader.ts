import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';
import { Question } from '@modules/question/domain/models/question.entity';

@Injectable({ scope: Scope.REQUEST })
export class QuestionLoader extends BaseDataLoader {
    readonly byId = new DataLoader<string, Question>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.questions.find({ where: { id: In(ids) } });
            return ids.map((id) => entities.find((e) => e.id === id));
        } catch (error) {
            throw error;
        }
    });
    readonly byPatientId = new DataLoader<string, Question[]>(async (patientIds: string[]) => {
        try {
            const entities: Question[] = await this.dbContext.questions.find({
                where: { patientId: In(patientIds) },
            });
            return patientIds.map((patientId) => entities.filter((e) => e.patientId === patientId) || null);
        } catch (error) {
            throw error;
        }
    });
}
