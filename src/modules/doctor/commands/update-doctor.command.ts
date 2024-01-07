import { Expose } from 'class-transformer';
import { Degree } from '../domain/enums/degree';
import { Profession } from '../domain/enums/profession';
import { Gender } from '@modules/user/domain/enums/gender';

export class UpdateDoctorCommand {
    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    phoneNumber?: string;

    @Expose()
    dateOfBirth?: Date;

    @Expose()
    gender: Gender;

    @Expose()
    address?: string;

    @Expose()
    profession: Profession;

    @Expose()
    degree: Degree;

    @Expose()
    title: string;

    @Expose()
    organization: string;

    doctorId: string;
}
