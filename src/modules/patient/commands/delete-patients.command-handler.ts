import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import { DeletePatientsCommand } from './delete-patients.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@CommandHandler(DeletePatientsCommand)
export class DeletePatientsCommandHandler extends BaseCommandHandler implements ICommandHandler<DeletePatientsCommand> {
    async execute({ ids }: DeletePatientsCommand): Promise<boolean> {
        const patients = await this.dbContext.patients.find({ where: { id: In(ids) }, relations: ['user'] });

        if (patients.length !== ids.length) {
            throw new NotFoundException(ErrorCode.PATIENT_NOT_FOUND);
        }

        await this.dbContext.patients.softRemove(patients);

        const users = patients.map((c) => c.user);
        await this.dbContext.users.softRemove(users);

        return true;
    }
}
