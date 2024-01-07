import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PermissionConnection, PermissionNode } from '../../graphql/types/connection-types/permission-connection-types';
import { GetAllPermisionsQuery } from './get-all-permissions.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllPermisionsQuery)
export class GetAllPermisionsQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllPermisionsQuery, PermissionConnection>
{
    async execute(): Promise<PermissionConnection> {
        const queryBuilder = this.dbContext.permissions.createQueryBuilder();

        const connection = await this.dbContext.permissions.getMany(queryBuilder, PermissionNode);

        return connection;
    }
}
