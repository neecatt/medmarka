import { Expose } from 'class-transformer';

export class OtpForgotPasswordCommand {
    @Expose()
    email: string;
}
