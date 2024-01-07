import { registerEnumType } from '@nestjs/graphql';

export enum QuestionStatus {
    PUBLISHED = 'PUBLISHED',
    REPORTED = 'REPORTED',
    REMOVED = 'REMOVED',
    BLOCKED = 'BLOCKED',
}

registerEnumType(QuestionStatus, { name: 'QuestionStatus' });
