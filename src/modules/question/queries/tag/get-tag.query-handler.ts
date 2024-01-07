import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetTagQuery } from './get-tag.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { TagNode } from '@modules/question/graphql/types/tag/tag-connection-types';

@QueryHandler(GetTagQuery)
export class GetTagQueryHandler extends BaseQueryHandler implements IQueryHandler<GetTagQuery, TagNode> {
    async execute({ id }: GetTagQuery): Promise<TagNode> {
        const tag = await this.dbContext.tags.findOneBy({ id });

        if (!tag) {
            throw new NotFoundException(ErrorCode.TAG_NOT_FOUND);
        }

        return plainToClass(TagNode, tag);
    }
}
