import { Expose } from 'class-transformer';

export class ChangePasswordCommand {
    @Expose()
    readonly currentPassword: string;

    @Expose()
    readonly newPassword: string;

    userId: string;
}
