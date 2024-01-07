import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SelectQueryBuilder } from 'typeorm';
import { GetAllTagsQuery } from './get-all-tags.query';
import { Tag } from '@modules/question/domain/models/tag.entity';
import { TagConnection, TagNode } from '@modules/question/graphql/types/tag/tag-connection-types';
import { TagOrderBy } from '@modules/question/graphql/types/tag/tag-order-by';
import { TagWhereInput } from '@modules/question/graphql/types/tag/tag-where-input';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllTagsQuery)
export class GetAllTagsQueryHandler extends BaseQueryHandler implements IQueryHandler<GetAllTagsQuery, TagConnection> {
    async execute({ tagConnectionArgs: { page, where, pageSize, orderBy } }: GetAllTagsQuery): Promise<TagConnection> {
        const queryBuilder = this.dbContext.tags.createQueryBuilder('t');

        this.buildWhere(queryBuilder, where);

        this.buildOrderBy(queryBuilder, orderBy);

        const connection = await this.dbContext.tags.getManyAndPaginate(queryBuilder, { page, pageSize }, TagNode);

        return connection;
    }

    private buildWhere(queryBuilder: SelectQueryBuilder<Tag>, where?: TagWhereInput): void {
        if (where?.name) {
            queryBuilder.andWhere(`t.name ILIKE :name`, { name: `%${where.name}%` });
        }
    }

    private buildOrderBy(queryBuilder: SelectQueryBuilder<Tag>, orderBy?: TagOrderBy): void {
        switch (orderBy) {
            case TagOrderBy.NAME_ASC:
                queryBuilder.orderBy('t.name', 'ASC');
                break;
            case TagOrderBy.NAME_DESC:
                queryBuilder.orderBy('t.name', 'DESC');
                break;

            default:
                queryBuilder.orderBy('t.created_at', 'DESC');
        }
    }
}
