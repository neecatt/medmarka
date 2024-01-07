import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../domain/models/user.entity';
import { GetUserQuery } from './get-user.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler extends BaseQueryHandler implements IQueryHandler<GetUserQuery, User> {
    async execute({ id }: GetUserQuery): Promise<User> {
        return await this.dbContext.users.findOne({ where: { id } });
    }
}
