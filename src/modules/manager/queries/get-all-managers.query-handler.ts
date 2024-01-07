import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SelectQueryBuilder } from 'typeorm';
import { Manager } from '../domain/models/manager.entity';
import { ManagerConnection, ManagerNode } from '../graphql/types/manager-connection-types';
import { ManagerOrderBy } from '../graphql/types/manager-order-by';
import { ManagerWhereInput } from '../graphql/types/manager-where-input';
import { GetAllManagersQuery } from './get-all-managers.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllManagersQuery)
export class GetAllManagersQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllManagersQuery, ManagerConnection>
{
    constructor() {
        super();
    }
    async execute({
        managerConnectionArgs: { page, where, pageSize, orderBy },
    }: GetAllManagersQuery): Promise<ManagerConnection> {
        const queryBuilder = this.dbContext.managers.createQueryBuilder('m');

        queryBuilder.leftJoin('m.user', 'u').leftJoin('u.userRoles', 'ur').leftJoin('ur.role', 'r');

        this.buildWhere(queryBuilder, where);

        this.buildOrderBy(queryBuilder, orderBy);

        const connection = await this.dbContext.managers.getManyAndPaginate(
            queryBuilder,
            { page, pageSize },
            ManagerNode,
        );

        return connection;
    }

    private buildWhere(queryBuilder: SelectQueryBuilder<Manager>, where?: ManagerWhereInput): void {
        if (where?.firstName) {
            queryBuilder.andWhere(`u.first_name ILIKE :firstName`, { firstName: `%${where.firstName}%` });
        }

        if (where?.lastName) {
            queryBuilder.andWhere(`u.last_name ILIKE :lastName`, { lastName: `%${where.lastName}%` });
        }

        if (where?.email) {
            queryBuilder.andWhere(`u.email ILIKE :email`, { email: `%${where.email}%` });
        }

        if (where?.role) {
            queryBuilder.andWhere(`r.name = :role`, where);
        }
    }

    private buildOrderBy(queryBuilder: SelectQueryBuilder<Manager>, orderBy?: ManagerOrderBy): void {
        switch (orderBy) {
            case ManagerOrderBy.NAME_ASC:
                queryBuilder.orderBy('u.first_name', 'ASC');
                break;
            case ManagerOrderBy.NAME_DESC:
                queryBuilder.orderBy('u.first_name', 'DESC');
                break;

            default:
                queryBuilder.orderBy('m.created_at', 'DESC');
        }
    }
}
