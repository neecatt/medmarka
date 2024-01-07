import { registerEnumType } from '@nestjs/graphql';

export enum PatientOrderBy {
    CREATED_AT_ASC = 'CREATED_AT_ASC',
    CREATED_AT_DESC = 'CREATED_AT_DESC',
}

registerEnumType(PatientOrderBy, { name: 'PatientOrderBy' });
