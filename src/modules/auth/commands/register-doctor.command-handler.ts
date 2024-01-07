import { BadRequestException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { genSalt, hash } from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';
import { RoleName } from '../../user/domain/enums/role-name';
import { RegisterDoctorPayload } from '../graphql/types/register-doctor-input';
import { AuthService } from '../services/auth.service';
import { RegisterDoctorCommand } from './register-doctor.command';
import { SendVerifyOtpCommand } from './send-verify-otp.command';
import { User } from '@modules/user/domain/models/user.entity';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { Doctor } from '@modules/doctor/domain/models/doctor.entity';

@CommandHandler(RegisterDoctorCommand)
export class RegisterDoctorCommandHandler extends BaseCommandHandler implements ICommandHandler<RegisterDoctorCommand> {
    constructor(private readonly commandBus: CommandBus, private readonly authService: AuthService) {
        super();
    }

    @Transactional()
    async execute({ email, emailVerified, userId, ...command }: RegisterDoctorCommand): Promise<RegisterDoctorPayload> {
        email = email?.toLowerCase();

        const existingUser = await this.dbContext.users.findOne({ where: { email } });

        if (existingUser) {
            throw new BadRequestException(ErrorCode.USER_ALREADY_EXISTS);
        }
        let user: User;
        if (userId) {
            user = await this.registerUser(email, command);
        } else {
            user = await this.registerUser(email, command, true);
        }

        const doctor = await this.registerDoctor(user, command);

        if (emailVerified) {
            await this.authService.activateAccount(email);
            return { id: doctor.id };
        } else {
            const obj = await this.commandBus.execute(new SendVerifyOtpCommand(email));
            return { id: doctor.id, token: obj.token };
        }
    }

    private async registerUser(
        email: string,
        command: Partial<RegisterDoctorCommand>,
        isRegistered = false,
    ): Promise<User> {
        const { password, firstName, lastName, ...userDetailsInfo } = command;

        const role = await this.dbContext.roles.findOne({ where: { name: RoleName.Doctor } });

        const passwordHash = await hash(password, await genSalt(10));

        const user = this.dbContext.users.create({
            userRoles: [{ role }],
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

        if (isRegistered) {
            user.isRegistered = isRegistered;
        }

        await this.dbContext.users.save(user);

        const userDetails = this.dbContext.userDetails.create({ user, ...userDetailsInfo });

        await this.dbContext.userDetails.save(userDetails);

        return user;
    }

    private async registerDoctor(user: User, command: Partial<RegisterDoctorCommand>): Promise<Doctor> {
        const { profession, title, organization, degree } = command;
        const doctor = this.dbContext.doctors.create({
            userId: user.id,
            profession,
            title,
            organization,
            degree,
        });

        await this.dbContext.doctors.save(doctor);

        return doctor;
    }
}
