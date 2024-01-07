import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { DeleteAnswerDislikePayload } from '../graphql/types/answer-dislike/delete-answer-dislike-mutation-types';
import { DeleteAnswerDislikeCommand } from './delete-answer-dislike.command';

@CommandHandler(DeleteAnswerDislikeCommand)
export class DeleteAnswerDislikeCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<DeleteAnswerDislikeCommand>
{
    @Transactional()
    async execute({ answerId, userId }: DeleteAnswerDislikeCommand): Promise<DeleteAnswerDislikePayload> {
        const answer = await this.dbContext.answers.findOneBy({ id: answerId });
        if (!answer) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        const user = await this.dbContext.users.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const answerDislike = await this.dbContext.answerDislikes.findOneBy({ answerId: answerId, id: userId });

        if (!answerDislike) {
            throw new BadRequestException(ErrorCode.ANSWER_DISLIKE_ALREADY_DELETED);
        }

        await this.dbContext.answerDislikes.softRemove(answerDislike);

        await this.dbContext.answers.decrement({ id: answer.id }, 'dislikeCount', 1);

        return { dislikeCount: answer.dislikeCount - 1 };
    }
}
