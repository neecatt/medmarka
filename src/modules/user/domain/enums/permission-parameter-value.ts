import { registerEnumType } from '@nestjs/graphql';

export enum PermissionParameterValue {
    ALL = 'ALL',
    COUNTRY = 'COUNTRY',
    USER = 'USER',
}

registerEnumType(PermissionParameterValue, { name: 'PermissionParameterValue' });
