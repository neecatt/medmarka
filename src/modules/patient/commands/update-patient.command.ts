import { Expose } from 'class-transformer';
import { Gender } from '@modules/user/domain/enums/gender';

export class UpdatePatientCommand {
    @Expose()
    readonly firstName: string;

    @Expose()
    readonly lastName: string;

    @Expose()
    readonly phoneNumber?: string;

    @Expose()
    readonly dateOfBirth?: Date;

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

    patientId?: string;

    userId?: string;
}
