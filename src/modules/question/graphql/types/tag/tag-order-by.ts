import { registerEnumType } from '@nestjs/graphql';

export enum TagOrderBy {
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC',
}

registerEnumType(TagOrderBy, { name: 'TagOrderBy' });
