import { registerEnumType } from '@nestjs/graphql';

export enum AnswerOrderBy {
    CREATED_AT_ASC = 'CREATED_AT_ASC',
    CREATED_AT_DESC = 'CREATED_AT_DESC',
}

registerEnumType(AnswerOrderBy, { name: 'AnswerOrderBy' });
