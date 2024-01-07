import { registerEnumType } from '@nestjs/graphql';

export enum PermissionParameterType {
    STRING = 'STRING',
}
registerEnumType(PermissionParameterType, { name: 'PermissionParameterType' });
