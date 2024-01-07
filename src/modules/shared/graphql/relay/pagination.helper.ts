import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ConnectionArgs } from './connection-args';
import { Connection } from './connection-type';

const PAGE_SIZE = 20;

type OffsetMeta = { limit?: number; offset?: number };

export function getPagingParameters({ page = 1, pageSize = PAGE_SIZE }: ConnectionArgs): OffsetMeta {
    return { limit: pageSize, offset: (page - 1) * pageSize };
}

export function getConnectionFromArray<TNode>(
    entities: any[],
    nodeCls: ClassType<TNode>,
    { page = 1, pageSize = PAGE_SIZE }: ConnectionArgs = {},
    count: number = entities.length,
): Connection<TNode> {
    const totalPages = Math.ceil(count / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
        totalCount: count,
        edges: entities.map((entity) => ({ node: plainToClass(nodeCls, entity) })),
        pageInfo: {
            page,
            totalPages,
            hasNextPage,
            hasPreviousPage,
        },
    };
}
