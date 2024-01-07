import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { FeedbackType } from '@modules/feedback/domain/enums/feedback-type';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';
import { FeedbackDecision } from '@modules/feedback/domain/enums/feedback-decision';
import { FeedbackSource } from '@modules/feedback/domain/enums/feedback-source-type';

@ObjectType('feedback', { implements: RelayNode })
export class FeedbackNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field(() => FeedbackType)
    reason: FeedbackType;

    @Field(() => FeedbackDecision)
    decision: FeedbackDecision;

    @Field({ nullable: true })
    customReason?: string;

    @Field()
    isRead: boolean;

    @Field()
    source: FeedbackSource;

    @Field()
    sourceId: string;

    @Field()
    createdAt: Date;

    @Field(() => Int)
    version: number;
}

@ObjectType()
export class FeedbackEdge extends EdgeType(FeedbackNode) {}

@ObjectType()
export class FeedbackConnection extends ConnectionType(FeedbackNode, FeedbackEdge) {}
