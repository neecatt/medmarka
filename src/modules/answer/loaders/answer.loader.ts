import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Answer } from '@modules/answer/domain/models/answer.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class AnswerLoader extends BaseDataLoader {
    readonly byQuestionId = new DataLoader<string, Answer[]>(async (questionIds: string[]) => {
        try {
            const entities: Answer[] = await this.dbContext.answers.find({
                where: { questionId: In(questionIds) },
            });
            return questionIds.map((questionId) => entities.filter((e) => e.questionId === questionId) || null);
        } catch (error) {
            throw error;
        }
    });
    readonly byId = new DataLoader<string, Answer>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.answers.find({ where: { id: In(ids) } });

            return ids.map((id) => entities.find((e) => e.id === id));
        } catch (error) {
            throw error;
        }
    });
    readonly byUserId = new DataLoader<string, Answer[]>(async (userIds: string[]) => {
        try {
            const entities: Answer[] = await this.dbContext.answers.find({
                where: { userId: In(userIds) },
            });
            return userIds.map((userId) => entities.filter((e) => e.userId === userId) || null);
        } catch (error) {
            throw error;
        }
    });
}
