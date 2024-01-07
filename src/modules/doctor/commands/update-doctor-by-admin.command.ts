import { Expose } from 'class-transformer';
import { Profession } from '../domain/enums/profession';
import { Degree } from '../domain/enums/degree';
import { Gender } from '@modules/user/domain/enums/gender';

export class UpdateDoctorByAdminCommand {
    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    phoneNumber?: string;

    @Expose()
    dateOfBirth: Date;

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

    @Expose()
    doctorId: string;
}
