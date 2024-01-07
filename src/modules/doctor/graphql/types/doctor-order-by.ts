import { registerEnumType } from '@nestjs/graphql';

export enum DoctorOrderBy {
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC',
}

registerEnumType(DoctorOrderBy, { name: 'DoctorOrderBy' });
