import { Inject } from '@nestjs/common';
import { DbContext } from '@modules/db/db-context';

export abstract class BaseQueryHandler {
    @Inject() protected readonly dbContext: DbContext;
}
