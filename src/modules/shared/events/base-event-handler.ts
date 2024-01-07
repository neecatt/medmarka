import { Inject } from '@nestjs/common';
import { DbContext } from '@modules/db/db-context';

export abstract class BaseEventHandler {
    @Inject() protected readonly dbContext: DbContext;
}
