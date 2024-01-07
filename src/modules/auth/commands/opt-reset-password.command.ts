import { Expose } from 'class-transformer';

export class OtpResetPasswordCommand {
    @Expose()
    readonly token: string;

    @Expose()
    readonly password: string;

    @Expose()
    readonly code: string;
}
