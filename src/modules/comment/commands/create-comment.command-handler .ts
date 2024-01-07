import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { CommentNode } from '../graphql/types/comment-connection-types';
import { CreateCommentPayload } from '../graphql/types/create-comment-mutation-types';
import { CreateCommentCommand } from './create-comment.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(CreateCommentCommand)
export class CreateCommandHandler extends BaseCommandHandler implements ICommandHandler<CreateCommentCommand> {
    @Transactional()
    async execute(command: CreateCommentCommand): Promise<CreateCommentPayload> {
        const { text, questionId, answerId, userId } = command;

        const question = await this.dbContext.questions.findOneBy({
            id: questionId,
        });

        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        const answer = await this.dbContext.answers.findOneBy({
            id: answerId,
        });

        if (!answer) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOneBy({ id: userId });

        if (userId && !user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const existComment = await this.dbContext.comments.findOneBy({
            questionId,
            answerId,
            userId,
        });

        if (existComment) {
            throw new ConflictException(ErrorCode.COMMENT_ALREADY_EXIST);
        }

        const comment = this.dbContext.comments.create({ question, answer, text, user });

        await this.dbContext.comments.save(comment);

        return { comment: plainToClass(CommentNode, comment) };
    }
}
