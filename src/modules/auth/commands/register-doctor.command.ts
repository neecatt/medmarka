import { Expose } from 'class-transformer';
import { Gender } from '@modules/user/domain/enums/gender';
import { Profession } from '@modules/doctor/domain/enums/profession';
import { Degree } from '@modules/doctor/domain/enums/degree';

export class RegisterDoctorCommand {
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
    readonly isVerified?: boolean;

    @Expose()
    readonly profession: Profession;

    @Expose()
    readonly degree: Degree;

    @Expose()
    readonly title: string;

    @Expose()
    readonly organization: string;

    userId?: string;
}
