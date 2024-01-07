import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { TagService } from '../../services/tag.service';
import { CreateTagCommand } from './create-tag.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { TagNode } from '@modules/question/graphql/types/tag/tag-connection-types';
import { CreateTagPayload } from '@modules/question/graphql/types/tag/create-tag-mutation-types';

@CommandHandler(CreateTagCommand)
export class CreateTagCommandHandler extends BaseCommandHandler implements ICommandHandler<CreateTagCommand> {
    constructor(private readonly tagService: TagService) {
        super();
    }
    @Transactional()
    async execute(command: CreateTagCommand): Promise<CreateTagPayload> {
        const existTag = await this.tagService.findExistTagsByName(command.name);

        if (existTag) {
            await this.tagService.tagUsageIncrement(existTag.id);
            return { tag: plainToClass(TagNode, existTag) };
        }

        const entity = this.dbContext.tags.create({ name: command.name });

        const tag = await this.dbContext.tags.save(entity);

        return { tag: plainToClass(TagNode, tag) };
    }
}
