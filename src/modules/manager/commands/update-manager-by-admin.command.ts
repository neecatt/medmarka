import { Expose } from 'class-transformer';
import { Gender } from '@modules/user/domain/enums/gender';

export class UpdateManagerByAdminCommand {
    @Expose()
    readonly id: string;

    @Expose()
    readonly firstName: string;

    @Expose()
    readonly lastName: string;

    @Expose()
    readonly email: string;

    @Expose()
    readonly phoneNumber: string;

    @Expose()
    readonly dateOfBirth?: Date;

    @Expose()
    readonly gender?: Gender;

    @Expose()
    readonly jobTitle?: string;

    @Expose()
    readonly roleIds: string[];
}
