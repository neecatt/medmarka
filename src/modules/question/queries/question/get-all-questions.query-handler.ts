import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { GetAllQuestionsQuery } from './get-all-questions.query';
import { Question } from '@modules/question/domain/models/question.entity';
import { QuestionConnection, QuestionNode } from '@modules/question/graphql/types/question/question-connection-types';
import { QuestionOrderBy } from '@modules/question/graphql/types/question/question-order-by';
import { QuestionWhereInput } from '@modules/question/graphql/types/question/question-where-input';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllQuestionsQuery)
export class GetAllQuestionsQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllQuestionsQuery, QuestionConnection>
{
    async execute({
        questionConnectionArgs: { page, where, pageSize, orderBy },
    }: GetAllQuestionsQuery): Promise<QuestionConnection> {
        const queryBuilder = this.dbContext.questions.createQueryBuilder('q');

        this.buildWhere(queryBuilder, where);

        this.buildOrderBy(queryBuilder, orderBy);

        const connection = await this.dbContext.questions.getManyAndPaginate(
            queryBuilder,
            { page, pageSize },
            QuestionNode,
        );

        return connection;
    }

    private buildWhere(queryBuilder: SelectQueryBuilder<Question>, where?: QuestionWhereInput): void {
        if (where?.title) {
            queryBuilder.andWhere(`q.title ILIKE :title`, { title: `%${where.title}%` });
        }
        if (where?.keyword) {
            this.filterByTerm(queryBuilder, where.keyword);
        }
    }

    private buildOrderBy(queryBuilder: SelectQueryBuilder<Question>, orderBy?: QuestionOrderBy): void {
        switch (orderBy) {
            case QuestionOrderBy.CREATED_AT_ASC:
                queryBuilder.orderBy('q.created_at', 'ASC');
                break;
            case QuestionOrderBy.CREATED_AT_DESC:
                queryBuilder.orderBy('q.created_at', 'DESC');
                break;

            default:
                queryBuilder.orderBy('q.created_at', 'DESC');
        }
    }

    private filterByTerm(queryBuilder: SelectQueryBuilder<Question>, keyword: string) {
        const tokens = keyword.split(' ').filter(Boolean);

        for (const [index, token] of tokens.entries()) {
            const parameters = { [`token_${index}`]: `%${token}%`, [`tags_${index}`]: [token] };

            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.orWhere(`q.title ILIKE :token_${index}`, parameters);
                    qb.orWhere(`SIMILARITY(:token_${index}, q.title) > 0.3`, parameters);
                }),
            );
        }
    }
}
