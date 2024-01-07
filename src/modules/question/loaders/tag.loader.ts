import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Tag } from '../domain/models/tag.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class TagLoader extends BaseDataLoader {
    readonly byQuestionId = new DataLoader<string, Tag[]>(async (questionIds: string[]) => {
        try {
            const entities = await this.dbContext.questions.find({
                where: { id: In(questionIds) },
                relations: { tags: true },
            });

            return questionIds.map((questionId) => {
                const question = entities.find((question) => question.id === questionId);

                if (!question) {
                    return new Error(`No question for ${questionId}`);
                }

                return question.tags;
            });
        } catch (error) {
            throw error;
        }
    });
}
