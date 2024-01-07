import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { UserNode } from '../../../user/graphql/types/connection-types/user-connection-types';
import { LoginCommand } from '../../commands/login.command';
import { RegisterDoctorCommand } from '../../commands/register-doctor.command';
import { AccessTokenPayload } from '../types/access-token-payload';
import { ActivateAccountInput, ActivateAccountPayload } from '../types/activate-account-mutation-types';
import { ChangePasswordInput, ChangePasswordPayload } from '../types/change-password-mutation-types';
import { CredentialsInput } from '../types/credentials-input';
import { ForgotPasswordInput, ForgotPasswordPayload } from '../types/forgot-password-mutation-types';
import { OtpForgotPasswordInput, OtpForgotPasswordPayload } from '../types/otp-forgot-password-mutation-types';
import { OtpResetPasswordInput, OtpResetPasswordPayload } from '../types/otp-reset-password-mutation-types';
import { RegisterDoctorByAdminInput } from '../types/regirster-doctor-by-admin-mutation-types';
import { RegisterPatientByAdminInput } from '../types/regirster-patient-by-admin-mutation-types';
import { RegisterManagerInput } from '../types/register-manager-input';
import { ResetPasswordInput, ResetPasswordPayload } from '../types/reset-password-mutation-types';
import { SendVerifyEmailInput, SendVerifyEmailPayload } from '../types/send-verify-email-mutation-types';
import { RegisterDoctorInput, RegisterDoctorPayload } from '../types/register-doctor-input';
import { RegisterPatientInput, RegisterPatientPayload } from '../types/register-patient-input';
import { ActivateAccountOtpInput, ActivateAccountOtpPayload } from '../types/activate-account-otp-mutation-types';
import { SendVerifyOtpInput, SendVerifyOtpPayload } from '../types/send-verify-otp-mutation-types';
import { GetUserQuery } from '@modules/user/queries/user/get-user.query';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { AuthorizeUser } from '@modules/auth/decorators/authorize-user.decorator';
import { SendVerifyEmailCommand } from '@modules/auth/commands/send-verify-email.command';
import { ResetPasswordCommand } from '@modules/auth/commands/reset-password.command';
import { RegisterPatientCommand } from '@modules/auth/commands/register-patient.command';
import { RegisterManagerCommand } from '@modules/auth/commands/register-manager.command';
import { OtpForgotPasswordCommand } from '@modules/auth/commands/otp-forgot-password.command';
import { OtpResetPasswordCommand } from '@modules/auth/commands/opt-reset-password.command';
import { ForgotPasswordCommand } from '@modules/auth/commands/forgot-password.command';
import { ChangePasswordCommand } from '@modules/auth/commands/change-password.command';
import { ActivateAccountCommand } from '@modules/auth/commands/activate-account.command';
import { ActivateAccountOtpCommand } from '@modules/auth/commands/activate-account-otp.command';
import { SendVerifyOtpCommand } from '@modules/auth/commands/send-verify-otp.command';

@Resolver()
export class AuthResolver {
    constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

    @AuthorizeUser()
    @Query(() => UserNode, { nullable: true })
    async me(@CurrentUser('id') id: string): Promise<UserNode> {
        return await this.queryBus.execute(new GetUserQuery(id));
    }

    @AuthorizeUser()
    @Query(() => UserNode)
    async user(@Args('id') id: string): Promise<UserNode> {
        return await this.queryBus.execute(new GetUserQuery(id));
    }

    @Mutation(() => RegisterDoctorPayload)
    async registerDoctor(@Args('doctor') input: RegisterDoctorInput): Promise<RegisterDoctorPayload> {
        const command = plainToClass(RegisterDoctorCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    // @AuthorizePermissions(PermissionName.CUSTOMERS_CREATE)
    @Mutation(() => String)
    async registerDoctorByAdmin(
        @Args('doctor') input: RegisterDoctorByAdminInput,
        @CurrentUser('id') userId: string,
    ): Promise<string> {
        const command = plainToClass(RegisterDoctorCommand, input, { excludeExtraneousValues: true });
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @Mutation(() => RegisterPatientPayload)
    async registerPatient(@Args('patient') input: RegisterPatientInput): Promise<RegisterPatientPayload> {
        const command = plainToClass(RegisterPatientCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    // @AuthorizePermissions(PermissionName.CUSTOMERS_CREATE)
    @Mutation(() => String)
    async registerPatientByAdmin(
        @Args('doctor') input: RegisterPatientByAdminInput,
        @CurrentUser('id') userId: string,
    ): Promise<string> {
        const command = plainToClass(RegisterPatientCommand, input, { excludeExtraneousValues: true });
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    // @AuthorizePermissions(PermissionName.COMMON_SETTINGS_CREATE)
    @Mutation(() => String)
    async registerManager(@Args('manager') input: RegisterManagerInput): Promise<string> {
        const command = plainToClass(RegisterManagerCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => AccessTokenPayload)
    async login(@Args('credentials') input: CredentialsInput): Promise<AccessTokenPayload> {
        const command = plainToClass(LoginCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => SendVerifyEmailPayload)
    async sendVerificationEmail(@Args('input') { email }: SendVerifyEmailInput): Promise<SendVerifyEmailPayload> {
        return await this.commandBus.execute(new SendVerifyEmailCommand(email));
    }

    @Mutation(() => SendVerifyOtpPayload)
    async sendVerificationOtp(@Args('input') { email }: SendVerifyOtpInput): Promise<SendVerifyOtpPayload> {
        return await this.commandBus.execute(new SendVerifyOtpCommand(email));
    }

    @Mutation(() => ActivateAccountPayload)
    async activateAccount(@Args('input') { token }: ActivateAccountInput): Promise<ActivateAccountPayload> {
        return await this.commandBus.execute(new ActivateAccountCommand(token));
    }

    @Mutation(() => ActivateAccountOtpPayload)
    async activateAccountOtp(
        @Args('input') { token, otp }: ActivateAccountOtpInput,
    ): Promise<ActivateAccountOtpPayload> {
        return await this.commandBus.execute(new ActivateAccountOtpCommand(token, otp));
    }

    @Mutation(() => ForgotPasswordPayload)
    async sendPasswordResetEmail(@Args('input') input: ForgotPasswordInput): Promise<ForgotPasswordPayload> {
        const command = plainToClass(ForgotPasswordCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => ResetPasswordPayload)
    async resetPassword(@Args('input') input: ResetPasswordInput): Promise<ResetPasswordPayload> {
        const command = plainToClass(ResetPasswordCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => OtpForgotPasswordPayload)
    async sendOtpPasswordResetEmail(@Args('input') input: OtpForgotPasswordInput): Promise<OtpForgotPasswordPayload> {
        const command = plainToClass(OtpForgotPasswordCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => OtpResetPasswordPayload)
    async OtpresetPassword(@Args('input') input: OtpResetPasswordInput): Promise<OtpResetPasswordPayload> {
        const command = plainToClass(OtpResetPasswordCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @AuthorizeUser()
    @Mutation(() => ChangePasswordPayload)
    async changePassword(
        @Args('input') input: ChangePasswordInput,
        @CurrentUser('id') userId: string,
    ): Promise<ChangePasswordPayload> {
        const command = plainToClass(ChangePasswordCommand, input, { excludeExtraneousValues: true });
        command.userId = userId;
        return await this.commandBus.execute(command);
    }
}
