import { Field, InputType } from '@nestjs/graphql';
import { FeedbackType } from '@modules/feedback/domain/enums/feedback-type';
import { FeedbackSource } from '@modules/feedback/domain/enums/feedback-source-type';

@InputType()
export class FeedbackWhereInput {
    @Field({ nullable: true })
    keyword?: string;

    @Field(() => FeedbackSource, { nullable: true })
    source?: FeedbackSource;

    @Field({ nullable: true })
    sourceId?: string;

    @Field({ nullable: true })
    isRead?: boolean;

    @Field(() => FeedbackType, { nullable: true })
    reason?: FeedbackType;
}
