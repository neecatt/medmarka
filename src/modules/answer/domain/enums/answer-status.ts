import { registerEnumType } from '@nestjs/graphql';

export enum AnswerStatus {
    PUBLISHED = 'PUBLISHED',
    REPORTED = 'REPORTED',
    REMOVED = 'REMOVED',
    BLOCKED = 'BLOCKED',
}

registerEnumType(AnswerStatus, { name: 'AnswerStatus' });
