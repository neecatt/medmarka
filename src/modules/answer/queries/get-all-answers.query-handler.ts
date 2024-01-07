import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { AnswerConnection, AnswerNode } from '../graphql/types/answer-connection-types';
import { Answer } from '../domain/models/answer.entity';
import { AnswerWhereInput } from '../graphql/types/answer-where-input';
import { AnswerOrderBy } from '../graphql/types/answer-order-by';
import { GetAllAnswersQuery } from './get-all-answers.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllAnswersQuery)
export class GetAllAnswersQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllAnswersQuery, AnswerConnection>
{
    async execute({
        answerConnectionArgs: { page, where, pageSize, orderBy },
    }: GetAllAnswersQuery): Promise<AnswerConnection> {
        const queryBuilder = this.dbContext.answers.createQueryBuilder('a');

        this.buildWhere(queryBuilder, where);

        this.buildOrderBy(queryBuilder, orderBy);

        const connection = await this.dbContext.answers.getManyAndPaginate(
            queryBuilder,
            { page, pageSize },
            AnswerNode,
        );

        return connection;
    }

    private buildWhere(queryBuilder: SelectQueryBuilder<Answer>, where?: AnswerWhereInput): void {
        if (where?.text) {
            queryBuilder.andWhere(`a.text ILIKE :text`, { text: `%${where.text}%` });
        }
        if (where?.keyword) {
            this.filterByTerm(queryBuilder, where.keyword);
        }
    }

    private buildOrderBy(queryBuilder: SelectQueryBuilder<Answer>, orderBy?: AnswerOrderBy): void {
        switch (orderBy) {
            case AnswerOrderBy.CREATED_AT_ASC:
                queryBuilder.orderBy('a.created_at', 'ASC');
                break;
            case AnswerOrderBy.CREATED_AT_DESC:
                queryBuilder.orderBy('a.created_at', 'DESC');
                break;

            default:
                queryBuilder.orderBy('a.created_at', 'DESC');
                queryBuilder.addOrderBy('a.index', 'DESC');
                queryBuilder.addOrderBy('a.likeCount', 'DESC');
        }
    }

    private filterByTerm(queryBuilder: SelectQueryBuilder<Answer>, keyword: string) {
        const tokens = keyword.split(' ').filter(Boolean);

        for (const [index, token] of tokens.entries()) {
            const parameters = { [`token_${index}`]: `%${token}%`, [`tags_${index}`]: [token] };

            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.orWhere(`a.text ILIKE :token_${index}`, parameters);
                    qb.orWhere(`SIMILARITY(:token_${index}, a.text) > 0.3`, parameters);
                }),
            );
        }
    }
}
