import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';
import { QuestionImage } from '../domain/models/question-image.entity';

@Injectable({ scope: Scope.REQUEST })
export class QuestionImageLoader extends BaseDataLoader {
    readonly byQuestionId = new DataLoader<string, QuestionImage[]>(async (questionIds: string[]) => {
        try {
            const entities = await this.dbContext.questionImages.find({
                where: { questionId: In(questionIds) },
            });
            return questionIds.map((questionId) => entities.filter((e) => e.questionId === questionId));
        } catch (error) {
            throw error;
        }
    });
}
