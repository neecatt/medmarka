import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ManagerNode } from '../graphql/types/manager-connection-types';
import { GetManagerQuery } from './get-manager.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@QueryHandler(GetManagerQuery)
export class GetManagerQueryHandler extends BaseQueryHandler implements IQueryHandler<GetManagerQuery, ManagerNode> {
    async execute({ id }: GetManagerQuery): Promise<ManagerNode> {
        const manager = await this.dbContext.managers.findOneBy({ id });

        if (!manager) {
            throw new NotFoundException(ErrorCode.MANAGER_NOT_FOUND);
        }

        return plainToClass(ManagerNode, manager);
    }
}
