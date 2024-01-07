import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ILike } from 'typeorm';
import { Tag } from '../domain/models/tag.entity';
import { CreateTagPayload } from '../graphql/types/tag/create-tag-mutation-types';
import { CreateTagCommand } from '../commands/tag/create-tag.command';
import { DbContext } from '@modules/db/db-context';

@Injectable()
export class TagService {
    constructor(readonly dbContext: DbContext, private readonly commandBus: CommandBus) {}

    async findExistTagsByName(name: string): Promise<Tag> {
        return await this.dbContext.tags.findOneBy({ name: ILike(name) });
    }

    async autoCreateTag(name: string): Promise<CreateTagPayload> {
        const tagCommand = new CreateTagCommand();
        tagCommand.name = name;
        tagCommand.isAutoCreated = true;
        const tag = await this.commandBus.execute(tagCommand);

        return tag;
    }

    async tagUsageIncrement(id: string): Promise<void> {
        const tag = await this.dbContext.tags.findOneBy({ id });
        tag.usageCount += 1;
        await this.dbContext.tags.save(tag);
    }
}
