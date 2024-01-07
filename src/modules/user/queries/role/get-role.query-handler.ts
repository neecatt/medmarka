import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { RoleNode } from '../../graphql/types/connection-types/role-connection-types';
import { GetRoleQuery } from './get-role.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@QueryHandler(GetRoleQuery)
export class GetRoleQueryHandler extends BaseQueryHandler implements IQueryHandler<GetRoleQuery, RoleNode> {
    async execute({ id }: GetRoleQuery): Promise<RoleNode> {
        const role = await this.dbContext.roles.findOne({ where: { id } });

        if (!role) {
            throw new NotFoundException(ErrorCode.ROLE_NOT_FOUND);
        }

        return role;
    }
}
