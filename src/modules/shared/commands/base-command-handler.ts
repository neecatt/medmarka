import { Inject } from '@nestjs/common';
import { EventBus, EventPublisher } from '@nestjs/cqrs';
import { DbContext } from '@modules/db/db-context';
import { Logger } from '@modules/infrastructure/logging/logger';

export abstract class BaseCommandHandler {
    @Inject() protected readonly dbContext: DbContext;
    @Inject() protected readonly publisher: EventPublisher;
    @Inject() protected readonly logger: Logger;
    @Inject() protected readonly eventBus: EventBus;
}
