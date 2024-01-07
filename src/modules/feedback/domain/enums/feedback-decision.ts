import { registerEnumType } from '@nestjs/graphql';

export enum FeedbackDecision {
    PENDING = 'PENDING',
    PASSED = 'PASSED',
    BLOCKED = 'BLOCKED',
    UNBLOCK = 'UNBLOCK',
}

registerEnumType(FeedbackDecision, { name: 'FeedbackDecision' });
