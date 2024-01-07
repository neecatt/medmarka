import { registerEnumType } from '@nestjs/graphql';

export enum FeedbackOrderBy {
    CREATED_AT_ASC = 'CREATED_AT_ASC',
    CREATED_AT_DESC = 'CREATED_AT_DESC',
}

registerEnumType(FeedbackOrderBy, { name: 'FeedbackOrderBy' });
