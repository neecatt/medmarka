import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { DeleteAnswerLikePayload } from '../graphql/types/answer-like/delete-answer-like-mutation-types';
import { DeleteAnswerLikeCommand } from './delete-answer-like.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(DeleteAnswerLikeCommand)
export class DeleteAnswerLikeCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<DeleteAnswerLikeCommand>
{
    @Transactional()
    async execute({ answerId, userId }: DeleteAnswerLikeCommand): Promise<DeleteAnswerLikePayload> {
        const answer = await this.dbContext.answers.findOneBy({ id: answerId });
        if (!answer) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const answerLike = await this.dbContext.answerLikes.findOneBy({ answerId: answerId, id: userId });

        if (!answerLike) {
            throw new BadRequestException(ErrorCode.ANSWER_LIKE_ALREADY_DELETED);
        }

        await this.dbContext.answerLikes.softRemove(answerLike);

        await this.dbContext.answers.decrement({ id: answer.id }, 'likeCount', 1);

        return { likeCount: answer.likeCount - 1 };
    }
}
