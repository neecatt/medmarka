import { ArgsType, Field } from '@nestjs/graphql';
import { FeedbackOrderBy } from './feedback-order-by';
import { FeedbackWhereInput } from './feedback-where-input';
import { ConnectionArgs } from '@modules/shared/graphql/relay';

@ArgsType()
export class FeedbackConnectionArgs extends ConnectionArgs {
    @Field(() => FeedbackWhereInput, { nullable: true })
    where?: FeedbackWhereInput;

    @Field(() => FeedbackOrderBy, { nullable: true })
    orderBy?: FeedbackOrderBy;
}
