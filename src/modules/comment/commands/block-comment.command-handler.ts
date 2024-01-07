import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BlockCommentPayload } from '../graphql/types/block-comment-mutation-types';
import { CommentStatus } from '../domain/enums/comment-status';
import { BlockCommentCommand } from './block-comment.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@CommandHandler(BlockCommentCommand)
export class BlockCommentCommandHandler extends BaseCommandHandler implements ICommandHandler<BlockCommentCommand> {
    async execute({ commentId }: BlockCommentCommand): Promise<BlockCommentPayload> {
        const comment = await this.dbContext.comments.findOneBy({ id: commentId });
        if (!comment) {
            throw new NotFoundException(ErrorCode.COMMENT_NOT_FOUND);
        }

        if (comment.status === CommentStatus.BLOCKED) {
            throw new BadRequestException(ErrorCode.COMMENT_ALREADY_BLOCKED);
        }

        comment.status = CommentStatus.BLOCKED;

        await this.dbContext.comments.save(comment);

        return { status: comment.status };
    }
}
