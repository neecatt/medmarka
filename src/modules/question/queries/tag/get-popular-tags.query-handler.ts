import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPopularTagsQuery } from './get-popular-tags.query';
import { TagConnection, TagNode } from '@modules/question/graphql/types/tag/tag-connection-types';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetPopularTagsQuery)
export class GetPopularTagsQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetPopularTagsQuery, TagConnection>
{
    async execute(query: GetPopularTagsQuery): Promise<TagConnection> {
        const { limit } = query;

        const queryBuilder = this.dbContext.tags.createQueryBuilder('t').limit(limit);

        const connection = await this.dbContext.tags.getMany(queryBuilder, TagNode);

        return connection;
    }
}
