import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { CommentConnection, CommentNode } from '../graphql/types/comment-connection-types';
import { CommentWhereInput } from '../graphql/types/comment-where-input';
import { CommentOrderBy } from '../graphql/types/comment-order-by';
import { Comment } from '../domain/models/comment.entity';
import { GetAllCommentsQuery } from './get-all-comments.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllCommentsQuery)
export class GetAllCommentsQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllCommentsQuery, CommentConnection>
{
    async execute({
        commentConnectionArgs: { page, where, pageSize, orderBy },
    }: GetAllCommentsQuery): Promise<CommentConnection> {
        const queryBuilder = this.dbContext.comments.createQueryBuilder('c');

        this.buildWhere(queryBuilder, where);

        this.buildOrderBy(queryBuilder, orderBy);

        const connection = await this.dbContext.comments.getManyAndPaginate(
            queryBuilder,
            { page, pageSize },
            CommentNode,
        );

        return connection;
    }

    private buildWhere(queryBuilder: SelectQueryBuilder<Comment>, where?: CommentWhereInput): void {
        if (where?.text) {
            queryBuilder.andWhere(`c.text ILIKE :text`, { text: `%${where.text}%` });
        }
        if (where?.keyword) {
            this.filterByTerm(queryBuilder, where.keyword);
        }
    }

    private buildOrderBy(queryBuilder: SelectQueryBuilder<Comment>, orderBy?: CommentOrderBy): void {
        switch (orderBy) {
            case CommentOrderBy.CREATED_AT_ASC:
                queryBuilder.orderBy('c.created_at', 'ASC');
                break;
            case CommentOrderBy.CREATED_AT_DESC:
                queryBuilder.orderBy('c.created_at', 'DESC');
                break;

            default:
                queryBuilder.orderBy('c.created_at', 'DESC');
        }
    }

    private filterByTerm(queryBuilder: SelectQueryBuilder<Comment>, keyword: string) {
        const tokens = keyword.split(' ').filter(Boolean);

        for (const [index, token] of tokens.entries()) {
            const parameters = { [`token_${index}`]: `%${token}%`, [`tags_${index}`]: [token] };

            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.orWhere(`c.text ILIKE :token_${index}`, parameters);
                    qb.orWhere(`SIMILARITY(:token_${index}, c.text) > 0.3`, parameters);
                }),
            );
        }
    }
}
