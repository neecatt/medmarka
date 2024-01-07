import { registerEnumType } from '@nestjs/graphql';

export enum FeedbackType {
    POLICY_VIOLATION = 'POLICY_VIOLATION',
    IRRELEVANT_IMAGE = 'IRRELEVANT_IMAGE',
    SPAM_SCAM = 'SPAM_SCAM',
    IRRELEVANT_DESCRIPTION = 'IRRELEVANT_DESCRIPTION',
    IRRELEVANT_CATEGORY = 'CATEGORY',
    OTHER = 'OTHER',
}

registerEnumType(FeedbackType, { name: 'FeedbackType' });
