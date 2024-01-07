import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { DeleteAnswersCommand } from './delete-answers.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(DeleteAnswersCommand)
export class DeleteAnswersCommandHandler extends BaseCommandHandler implements ICommandHandler<DeleteAnswersCommand> {
    @Transactional()
    async execute({ ids }: DeleteAnswersCommand): Promise<boolean> {
        const answers = await this.dbContext.answers.find({
            where: { id: In(ids) },
        });

        if (answers.length !== ids.length) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        await this.dbContext.answers.softRemove(answers);

        return true;
    }
}
