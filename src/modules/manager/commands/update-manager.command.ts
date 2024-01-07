import { Expose } from 'class-transformer';
import { Gender } from '@modules/user/domain/enums/gender';

export class UpdateManagerCommand {
    userId: string;

    @Expose()
    readonly firstName: string;

    @Expose()
    readonly lastName: string;

    @Expose()
    readonly phoneNumber: string;

    @Expose()
    readonly dateOfBirth?: Date;

    @Expose()
    readonly gender?: Gender;

    @Expose()
    readonly jobTitle?: string;
}
