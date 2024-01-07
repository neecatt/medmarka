import { registerEnumType } from '@nestjs/graphql';

export enum RoleName {
    Default = 'default',
    Manager = 'manager',
    Patient = 'patient',
    Doctor = 'Doctor',
}

registerEnumType(RoleName, { name: 'RoleName' });
