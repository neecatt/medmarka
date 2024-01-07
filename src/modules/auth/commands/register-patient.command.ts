import { Expose } from 'class-transformer';
import { Gender } from '@modules/user/domain/enums/gender';

export class RegisterPatientCommand {
    @Expose()
    readonly firstName: string;

    @Expose()
    readonly lastName: string;

    @Expose()
    readonly email: string;

    @Expose()
    readonly password: string;

    @Expose()
    readonly phoneNumber?: string;

    @Expose()
    readonly dateOfBirth: Date;

    @Expose()
    readonly gender: Gender;

    @Expose()
    readonly address?: string;

    @Expose()
    readonly emailVerified?: boolean;

    @Expose()
    readonly showProfile: boolean;

    @Expose()
    readonly organization: string;

    userId?: string;
}
