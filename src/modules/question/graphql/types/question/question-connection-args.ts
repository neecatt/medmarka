import { ArgsType, Field } from '@nestjs/graphql';
import { QuestionOrderBy } from './question-order-by';
import { QuestionWhereInput } from './question-where-input';
import { ConnectionArgs } from '@modules/shared/graphql/relay';

@ArgsType()
export class QuestionConnectionArgs extends ConnectionArgs {
    @Field(() => QuestionWhereInput, { nullable: true })
    where?: QuestionWhereInput;

    @Field(() => QuestionOrderBy, { nullable: true })
    orderBy?: QuestionOrderBy;
}
