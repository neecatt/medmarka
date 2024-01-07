import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RoleConnection, RoleNode } from '../../graphql/types/connection-types/role-connection-types';
import { GetAllRolesQuery } from './get-all-roles.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { RoleName } from '@modules/user/domain/enums/role-name';

@QueryHandler(GetAllRolesQuery)
export class GetAllRolesQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllRolesQuery, RoleConnection>
{
    async execute(): Promise<RoleConnection> {
        const queryBuilder = this.dbContext.roles.createQueryBuilder();

        queryBuilder.where('name != :name', { name: RoleName.Default });

        const connection = await this.dbContext.roles.getMany(queryBuilder, RoleNode);

        return connection;
    }
}
