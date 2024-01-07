import { BadRequestException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { genSalt, hash } from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';
import { RoleName } from '../../user/domain/enums/role-name';
import { AuthService } from '../services/auth.service';
import { RegisterPatientPayload } from '../graphql/types/register-patient-input';
import { RegisterPatientCommand } from './register-patient.command';
import { SendVerifyOtpCommand } from './send-verify-otp.command';
import { User } from '@modules/user/domain/models/user.entity';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { Patient } from '@modules/patient/domain/models/patient.entity';

@CommandHandler(RegisterPatientCommand)
export class RegisterPatientCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<RegisterPatientCommand>
{
    constructor(private readonly commandBus: CommandBus, private readonly authService: AuthService) {
        super();
    }

    @Transactional()
    async execute({
        email,
        emailVerified,
        userId,
        showProfile,
        ...command
    }: RegisterPatientCommand): Promise<RegisterPatientPayload> {
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

        const patient = await this.registerPatient(user, showProfile);

        if (emailVerified) {
            await this.authService.activateAccount(email);
            return { id: patient.id };
        } else {
            const obj = await this.commandBus.execute(new SendVerifyOtpCommand(email));
            return { id: patient.id, token: obj.token };
        }
    }

    private async registerUser(
        email: string,
        command: Partial<RegisterPatientCommand>,
        registered = false,
    ): Promise<User> {
        const { password, firstName, lastName, ...userDetailsInfo } = command;

        const role = await this.dbContext.roles.findOne({ where: { name: RoleName.Patient } });

        const passwordHash = await hash(password, await genSalt(10));

        const user = this.dbContext.users.create({
            userRoles: [{ role }],
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

        if (registered) {
            user.isRegistered = registered;
        }

        await this.dbContext.users.save(user);

        const userDetails = this.dbContext.userDetails.create({ user, ...userDetailsInfo });

        await this.dbContext.userDetails.save(userDetails);

        return user;
    }

    private async registerPatient(user: User, showProfile: boolean): Promise<Patient> {
        const patient = this.dbContext.patients.create({
            userId: user.id,
            showProfile,
        });

        await this.dbContext.patients.save(patient);

        return patient;
    }
}
