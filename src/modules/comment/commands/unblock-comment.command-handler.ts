import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommentStatus } from '../domain/enums/comment-status';
import { UnBlockCommentPayload } from '../graphql/types/unblock-comment-mutation-types';
import { UnBlockCommentCommand } from './unblock-comment.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@CommandHandler(UnBlockCommentCommand)
export class UnBlockCommentCommandHandler extends BaseCommandHandler implements ICommandHandler<UnBlockCommentCommand> {
    async execute({ commentId }: UnBlockCommentCommand): Promise<UnBlockCommentPayload> {
        const comment = await this.dbContext.comments.findOneBy({ id: commentId });
        if (!comment) {
            throw new NotFoundException(ErrorCode.COMMENT_NOT_FOUND);
        }

        if (comment.status === CommentStatus.PUBLISHED) {
            throw new BadRequestException(ErrorCode.COMMENT_ALREADY_PUBLISHED);
        }

        comment.status = CommentStatus.PUBLISHED;

        await this.dbContext.comments.save(comment);

        return { status: comment.status };
    }
}
