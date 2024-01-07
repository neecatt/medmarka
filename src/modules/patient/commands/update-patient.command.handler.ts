import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { PatientNode } from '../graphql/types/patient-connection-types';
import { UpdatePatientPayload } from '../graphql/types/update-patient-mutation-types';
import { UpdatePatientCommand } from './update-patient.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(UpdatePatientCommand)
export class UpdatePatientCommandHandler extends BaseCommandHandler implements ICommandHandler<UpdatePatientCommand> {
    constructor() {
        super();
    }

    @Transactional()
    async execute({ patientId, firstName, lastName, ...details }: UpdatePatientCommand): Promise<UpdatePatientPayload> {
        const patient = await this.dbContext.patients.findOne({
            where: { id: patientId },
            relations: ['user', 'user.details'],
        });

        if (!patient) {
            throw new NotFoundException(ErrorCode.PATIENT_NOT_FOUND);
        }

        patient.user.firstName = firstName;
        patient.user.lastName = lastName;

        await this.dbContext.users.save(patient.user);

        patient.user.details = {
            ...patient.user.details,
            ...details,
        };

        await this.dbContext.userDetails.save(patient.user.details);

        await this.dbContext.patients.save(patient);

        return { patient: plainToClass(PatientNode, patient) };
    }
}
