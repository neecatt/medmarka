import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { DeleteDoctorsCommand } from './delete-doctors.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(DeleteDoctorsCommand)
export class DeleteDoctorsCommandHandler extends BaseCommandHandler implements ICommandHandler<DeleteDoctorsCommand> {
    @Transactional()
    async execute({ ids }: DeleteDoctorsCommand): Promise<boolean> {
        const doctors = await this.dbContext.doctors.find({
            where: { id: In(ids) },
            relations: ['user'],
        });

        if (doctors.length !== ids.length) {
            throw new NotFoundException(ErrorCode.DOCTOR_NOT_FOUND);
        }

        const users = doctors.map((m) => m.user);
        await this.dbContext.users.softRemove(users);

        await this.dbContext.doctors.softRemove(doctors);

        return true;
    }
}
