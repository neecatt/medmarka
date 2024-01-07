import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { DeleteQuestionsCommand } from './delete-questions.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(DeleteQuestionsCommand)
export class DeleteQuestionsCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<DeleteQuestionsCommand>
{
    @Transactional()
    async execute({ ids }: DeleteQuestionsCommand): Promise<boolean> {
        const questions = await this.dbContext.questions.find({
            where: { id: In(ids) },
        });

        if (questions.length !== ids.length) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        await this.dbContext.questions.softRemove(questions);

        return true;
    }
}
