import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { DoctorNode } from '../graphql/types/doctor-connection-types';
import { UpdateDoctorPayload } from '../graphql/types/update-doctor-mutation-types';
import { UpdateDoctorCommand } from './update-doctor.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(UpdateDoctorCommand)
export class UpdateDoctorCommandHandler extends BaseCommandHandler implements ICommandHandler<UpdateDoctorCommand> {
    @Transactional()
    async execute(command: UpdateDoctorCommand): Promise<UpdateDoctorPayload> {
        const {
            doctorId,
            firstName,
            lastName,
            gender,
            profession,
            degree,
            title,
            organization,
            dateOfBirth,
            phoneNumber,
            address,
        } = command;

        const doctor = await this.dbContext.doctors.findOne({
            where: { id: doctorId },
            relations: ['user', 'user.details'],
        });

        if (!doctor) {
            throw new NotFoundException(ErrorCode.DOCTOR_NOT_FOUND);
        }

        await this.dbContext.doctors.save({ ...doctor, profession, degree, title, organization });

        const { user } = doctor;

        await this.dbContext.users.save({
            ...user,
            firstName,
            lastName,
            details: { ...user.details, phoneNumber, dateOfBirth, gender, address },
        });

        return { doctor: plainToClass(DoctorNode, doctor) };
    }
}
