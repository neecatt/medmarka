import { PatientConnectionArgs } from '../graphql/types/patient-connection-args';

export class GetAllPatientsQuery {
    constructor(public readonly patientConnectionArgs: PatientConnectionArgs) {}
}
