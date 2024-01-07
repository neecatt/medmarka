import { Expose } from 'class-transformer';

export class VerifyOtpCommand {
    @Expose()
    readonly token: string;

    @Expose()
    readonly code: string;
}
