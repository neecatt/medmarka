import { registerEnumType } from '@nestjs/graphql';

export enum PatientStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

registerEnumType(PatientStatus, { name: 'PatientStatus' });
