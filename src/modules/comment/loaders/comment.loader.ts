import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Comment } from '../domain/models/comment.entity';
import { BaseDataLoader } from '@modules/shared/loaders/base-data-loader';

@Injectable({ scope: Scope.REQUEST })
export class CommmentLoader extends BaseDataLoader {
    readonly byId = new DataLoader<string, Comment>(async (ids: string[]) => {
        try {
            const entities = await this.dbContext.comments.find({ where: { id: In(ids) } });
            return ids.map((id) => entities.find((e) => e.id === id));
        } catch (error) {
            throw error;
        }
    });
    readonly byAnswerId = new DataLoader<string, Comment[]>(async (answerIds: string[]) => {
        try {
            const entities: Comment[] = await this.dbContext.comments.find({
                where: { answerId: In(answerIds) },
            });
            return answerIds.map((answerId) => entities.filter((e) => e.answerId === answerId) || null);
        } catch (error) {
            throw error;
        }
    });
}
