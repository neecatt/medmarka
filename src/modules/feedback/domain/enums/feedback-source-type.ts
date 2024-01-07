import { registerEnumType } from '@nestjs/graphql';

export enum FeedbackSource {
    ANSWER = 'ANSWER',
    COMMENT = 'COMMENT',
    QUESTION = 'QUESTION',
}

registerEnumType(FeedbackSource, { name: 'FeedbackSource' });
