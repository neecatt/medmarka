import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ActivateAccountCommandHandler } from './commands/activate-account.command-handler';
import { ChangePasswordCommandHandler } from './commands/change-password.command-handler';
import { ForgotPasswordCommandHandler } from './commands/forgot-password.command-handler';
import { LoginCommandHandler } from './commands/login.command-handler';
import { ResetPasswordCommandHandler } from './commands/reset-password.command-handler';
import { SendVerifyEmailCommandHandler } from './commands/send-verify-email.command-handler';
import { AuthResolver } from './graphql/resolvers/auth.resolver';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthService } from './services/auth.service';
import { WsAuthService } from './services/ws-auth.service';
import { OtpForgotPasswordCommandHandler } from './commands/otp-forgot-password.command-handler';
import { OtpResetPasswordCommandHandler } from './commands/opt-reset-password.command-handler';
import { RegisterPatientCommandHandler } from './commands/register-patient.command-handler';
import { RegisterManagerCommandHandler } from './commands/register-manager.command-handler';
import { RegisterDoctorCommandHandler } from './commands/register-doctor.command-handler';
import { VerifyOtpCommandHandler } from './commands/verify-otp.command-handler';
import { SendVerifyOtpCommandHandler } from './commands/send-verify-otp.command-handler';
import { ActivateAccountOtpCommandHandler } from './commands/activate-account-otp.command-handler';
import { FileService } from '@modules/file/services/file.service';
import { JWT_SECRET } from '@config/environment';
import { PermissionService } from '@modules/user/service/permission.service';

const loaders = [];

const resolvers = [AuthResolver];

const commandHandlers = [
    LoginCommandHandler,
    ActivateAccountCommandHandler,
    SendVerifyEmailCommandHandler,
    ForgotPasswordCommandHandler,
    ResetPasswordCommandHandler,
    ChangePasswordCommandHandler,
    OtpForgotPasswordCommandHandler,
    OtpResetPasswordCommandHandler,
    RegisterPatientCommandHandler,
    RegisterManagerCommandHandler,
    RegisterDoctorCommandHandler,
    ActivateAccountOtpCommandHandler,
    VerifyOtpCommandHandler,
    SendVerifyOtpCommandHandler,
];

const queryHandlers = [];

const services = [AuthService, WsAuthService, JwtStrategy, FileService, PermissionService];

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {
                expiresIn: '365d',
            },
        }),
    ],
    providers: [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, ...services],
    exports: [AuthService, WsAuthService],
})
export class AuthModule {}
