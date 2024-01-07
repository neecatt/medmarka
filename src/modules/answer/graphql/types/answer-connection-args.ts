import { ArgsType, Field } from '@nestjs/graphql';
import { AnswerWhereInput } from './answer-where-input';
import { AnswerOrderBy } from './answer-order-by';
import { ConnectionArgs } from '@modules/shared/graphql/relay';

@ArgsType()
export class AnswerConnectionArgs extends ConnectionArgs {
    @Field(() => AnswerWhereInput, { nullable: true })
    where?: AnswerWhereInput;

    @Field(() => AnswerOrderBy, { nullable: true })
    orderBy?: AnswerOrderBy;
}
