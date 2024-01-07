import { ClassType } from 'class-transformer/ClassTransformer';
import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { Connection, ConnectionArgs, getConnectionFromArray, getPagingParameters } from '../graphql/relay';

type RelayRepository<TEntity> = Repository<TEntity> & {
    getManyAndPaginate<TNode>(
        queryBuilder: SelectQueryBuilder<TEntity>,
        args: ConnectionArgs,
        nodeCls: ClassType<TNode>,
    ): Promise<Connection<TNode>>;

    findAndPaginate<TNode>(
        condition: FindManyOptions<TEntity>,
        args: ConnectionArgs,
        nodeCls: ClassType<TNode>,
    ): Promise<Connection<TNode>>;

    getMany<TNode>(queryBuilder: SelectQueryBuilder<TEntity>, nodeCls: ClassType<TNode>): Promise<Connection<TNode>>;
};

export const relayRepository = <TEntity>(repository: Repository<TEntity>): RelayRepository<TEntity> => {
    return repository.extend({
        async findAndPaginate<TNode>(
            condition: FindManyOptions<TEntity>,
            args: ConnectionArgs,
            nodeCls: ClassType<TNode>,
        ): Promise<Connection<TNode>> {
            const { limit, offset } = getPagingParameters(args);
            const [entities, count] = await repository.findAndCount({
                ...condition,
                skip: offset,
                take: limit,
            });

            return getConnectionFromArray(entities, nodeCls, args, count);
        },
        async getManyAndPaginate<TNode>(
            queryBuilder: SelectQueryBuilder<TEntity>,
            args: ConnectionArgs,
            nodeCls: ClassType<TNode>,
        ): Promise<Connection<TNode>> {
            const { limit, offset } = getPagingParameters(args);
            const [entities, count] = await queryBuilder.offset(offset).limit(limit).getManyAndCount();

            return getConnectionFromArray(entities, nodeCls, args, count);
        },
        async getMany<TNode>(
            queryBuilder: SelectQueryBuilder<TEntity>,
            nodeCls: ClassType<TNode>,
        ): Promise<Connection<TNode>> {
            const [entities, count] = await queryBuilder.getManyAndCount();

            return getConnectionFromArray(entities, nodeCls, { pageSize: count }, count);
        },
    });
};
