import { registerEnumType } from '@nestjs/graphql';

export enum CommentOrderBy {
    CREATED_AT_ASC = 'CREATED_AT_ASC',
    CREATED_AT_DESC = 'CREATED_AT_DESC',
}

registerEnumType(CommentOrderBy, { name: 'CommentOrderBy' });
