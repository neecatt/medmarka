import { registerEnumType } from '@nestjs/graphql';

export enum QuestionOrderBy {
    CREATED_AT_ASC = 'CREATED_AT_ASC',
    CREATED_AT_DESC = 'CREATED_AT_DESC',
}

registerEnumType(QuestionOrderBy, { name: 'QuestionOrderBy' });
