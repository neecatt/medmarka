import { registerEnumType } from '@nestjs/graphql';

export enum ManagerOrderBy {
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC',
}

registerEnumType(ManagerOrderBy, { name: 'ManagerOrderBy' });
