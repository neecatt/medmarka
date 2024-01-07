import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyDoctorsCommand } from './verify-doctor.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(VerifyDoctorsCommand)
export class VerifyDoctorsCommandHandler extends BaseCommandHandler implements ICommandHandler<VerifyDoctorsCommand> {
    async execute({ id }: VerifyDoctorsCommand): Promise<boolean> {
        const doctor = await this.dbContext.doctors.findOneBy({ id });

        if (!doctor) {
            throw new NotFoundException(ErrorCode.DOCTOR_NOT_FOUND);
        }

        doctor.isVerified = true;

        await this.dbContext.doctors.save(doctor);

        return true;
    }
}
