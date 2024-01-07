import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { FeedbackNode } from './feedback-connection-types';
import { FeedbackDecision } from '@modules/feedback/domain/enums/feedback-decision';

@InputType()
export class MakeDecisionInput {
    @Field(() => ID)
    id: string;

    @IsNotEmpty()
    @Field(() => FeedbackDecision)
    decision: FeedbackDecision;
}

@ObjectType()
export class MakeDecisionPayload {
    @Field(() => FeedbackNode)
    feedBack: FeedbackNode;
}
