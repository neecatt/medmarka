import { Inject } from '@nestjs/common';
import { DbContext } from '@modules/db/db-context';

export abstract class BaseDataLoader {
    @Inject() protected readonly dbContext: DbContext;
}
