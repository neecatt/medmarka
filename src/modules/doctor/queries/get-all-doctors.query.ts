import { DoctorConnectionArgs } from '../graphql/types/doctor-connection-args';

export class GetAllDoctorsQuery {
    constructor(public readonly doctorConnectionArgs: DoctorConnectionArgs) {}
}
