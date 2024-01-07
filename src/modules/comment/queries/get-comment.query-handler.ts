import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CommentNode } from '../graphql/types/comment-connection-types';
import { GetCommentQuery } from './get-comment.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@QueryHandler(GetCommentQuery)
export class GetCommentQueryHandler extends BaseQueryHandler implements IQueryHandler<GetCommentQuery, CommentNode> {
    async execute({ id }: GetCommentQuery): Promise<CommentNode> {
        const comment = await this.dbContext.comments.findOneBy({ id });

        if (!comment) {
            throw new NotFoundException(ErrorCode.COMMENT_NOT_FOUND);
        }

        return plainToClass(CommentNode, comment);
    }
}
