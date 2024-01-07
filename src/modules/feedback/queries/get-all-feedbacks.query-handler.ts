import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { Feedback } from '../domain/models/feedback.entity';
import { FeedbackConnection, FeedbackNode } from '../graphql/types/feedback-connection-types';
import { FeedbackOrderBy } from '../graphql/types/feedback-order-by';
import { FeedbackWhereInput } from '../graphql/types/feedback-where-input';
import { GetAllFeedbacksQuery } from './get-all-feedbacks.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllFeedbacksQuery)
export class GetAllFeedbacksQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllFeedbacksQuery, FeedbackConnection>
{
    async execute(query: GetAllFeedbacksQuery): Promise<FeedbackConnection> {
        const { connectionArgs } = query;
        const { orderBy, where, page, pageSize } = connectionArgs;

        const queryBuilder = this.dbContext.feedbacks.createQueryBuilder('f');

        this.buildWhere(queryBuilder, where);

        this.buildOrderBy(queryBuilder, orderBy);

        return await this.dbContext.feedbacks.getManyAndPaginate(queryBuilder, { page, pageSize }, FeedbackNode);
    }

    private buildWhere(queryBuilder: SelectQueryBuilder<Feedback>, where: FeedbackWhereInput): void {
        if (where?.reason) {
            queryBuilder.andWhere('f.reason = :reason', where);
        }

        if (where?.isRead !== undefined) {
            queryBuilder.andWhere('f.is_read = :isRead', where);
        }

        if (where?.source) {
            queryBuilder.andWhere('f.source = :source', where);
        }

        if (where?.sourceId) {
            queryBuilder.andWhere('f.source_id = :sourceId', where);
        }

        if (where?.keyword) {
            this.filterByTerm(queryBuilder, where.keyword);
        }
    }

    private buildOrderBy(queryBuilder: SelectQueryBuilder<Feedback>, orderBy?: FeedbackOrderBy): void {
        switch (orderBy) {
            case FeedbackOrderBy.CREATED_AT_ASC:
                queryBuilder.orderBy('f.created_at', 'ASC');
                break;

            case FeedbackOrderBy.CREATED_AT_DESC:
                queryBuilder.orderBy('f.created_at', 'DESC');
                break;

            default:
                queryBuilder.orderBy('f.created_at', 'DESC');
        }
    }

    private filterByTerm(queryBuilder: SelectQueryBuilder<Feedback>, keyword: string) {
        const tokens = keyword.split(' ').filter(Boolean);

        for (const [index, token] of tokens.entries()) {
            const parameters = { [`token_${index}`]: `%${token}%`, [`tags_${index}`]: [token] };

            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.orWhere(`f.reason ILIKE :token_${index}`, parameters);
                    qb.orWhere(`SIMILARITY(:token_${index}, f.reason) > 0.3`, parameters);

                    qb.orWhere(`f.custom_reason ILIKE :token_${index}`, parameters);
                    qb.orWhere(`SIMILARITY(:token_${index}, f.custom_reason) > 0.3`, parameters);

                    qb.orWhere(`a.title ILIKE :token_${index}`, parameters);
                    qb.orWhere(`SIMILARITY(:token_${index}, a.title) > 0.3`, parameters);

                    qb.orWhere(`a.sub_title ILIKE :token_${index}`, parameters);
                    qb.orWhere(`SIMILARITY(:token_${index}, a.sub_title ) > 0.3`, parameters);

                    qb.orWhere(`f.reason ILIKE :token_${index}`, parameters);
                    qb.orWhere(`SIMILARITY(:token_${index}, f.reason ) > 0.3`, parameters);
                }),
            );
        }
    }
}
