import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { DoctorNode } from '../graphql/types/doctor-connection-types';
import { UpdateDoctorByAdminPayload } from '../graphql/types/update-doctor-by-admin-mutation-types';
import { UpdateDoctorByAdminCommand } from './update-doctor-by-admin.command';
import { PermissionService } from '@modules/user/service/permission.service';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(UpdateDoctorByAdminCommand)
export class UpdateDoctorByAdminCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<UpdateDoctorByAdminCommand>
{
    constructor(private readonly permissionService: PermissionService) {
        super();
    }
    @Transactional()
    async execute(command: UpdateDoctorByAdminCommand): Promise<UpdateDoctorByAdminPayload> {
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
