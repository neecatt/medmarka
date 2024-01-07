import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SelectQueryBuilder } from 'typeorm';
import { UserPermission } from '../../domain/models/user-permission.entity';
import {
    UserPermissionConnection,
    UserPermissionNode,
} from '../../graphql/types/connection-types/user-permission-connection-types';
import { UserPermissionWhereInput } from '../../graphql/types/user-permission-where-input';
import { GetAllUserPermisionsQuery } from './get-all-user-permissions.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllUserPermisionsQuery)
export class GetAllUserPermisionsQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllUserPermisionsQuery, UserPermissionConnection>
{
    async execute({
        connectionArgs: { where, page, pageSize },
    }: GetAllUserPermisionsQuery): Promise<UserPermissionConnection> {
        const queryBuilder = this.dbContext.userPermissions.createQueryBuilder();

        this.buildWhere(queryBuilder, where);

        if (where?.isGetAll) {
            return await this.dbContext.userPermissions.getMany(queryBuilder, UserPermissionNode);
        }

        const connection = await this.dbContext.userPermissions.getManyAndPaginate(
            queryBuilder,
            { page, pageSize },
            UserPermissionNode,
        );

        return connection;
    }

    private buildWhere(queryBuilder: SelectQueryBuilder<UserPermission>, where: UserPermissionWhereInput) {
        queryBuilder.where('user_Id = :userId', where);
    }
}
