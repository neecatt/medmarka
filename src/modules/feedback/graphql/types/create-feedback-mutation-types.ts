import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FeedbackNode } from './feedback-connection-types';
import { FeedbackType } from '@modules/feedback/domain/enums/feedback-type';

@InputType()
export class CreateFeedbackInput {
    @Field(() => FeedbackType)
    reason: FeedbackType;

    @Field({ nullable: true })
    customReason?: string;

    @Field()
    sourceId: string;
}

@ObjectType()
export class CreateFeedbackPayload {
    @Field(() => FeedbackNode)
    feedback: FeedbackNode;
}
