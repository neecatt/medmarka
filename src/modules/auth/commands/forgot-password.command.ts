import { Expose } from 'class-transformer';

export class ForgotPasswordCommand {
    @Expose()
    email: string;
}
