import { Expose } from 'class-transformer';

export class ResetPasswordCommand {
    @Expose()
    readonly token: string;

    @Expose()
    readonly password: string;
}
