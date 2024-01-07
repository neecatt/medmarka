import { Expose } from 'class-transformer';

export class LoginCommand {
    @Expose()
    readonly email: string;

    @Expose()
    readonly password: string;
}
