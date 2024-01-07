import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommentNode } from '../graphql/types/comment-connection-types';
import { UpdateCommentPayload } from '../graphql/types/update-comment-mutation-types';
import { UpdateCommentCommand } from './update-comment.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentCommandHandler extends BaseCommandHandler implements ICommandHandler<UpdateCommentCommand> {
    async execute(command: UpdateCommentCommand): Promise<UpdateCommentPayload> {
        const { id, userId, text } = command;

        const comment = await this.dbContext.comments.findOne({
            where: { id, userId },
        });

        if (!comment) {
            throw new NotFoundException(ErrorCode.COMMENT_NOT_FOUND);
        }

        await this.dbContext.comments.save({ ...comment, text });

        return { comment: plainToClass(CommentNode, comment) };
    }
}
