import { ArgsType, Field } from '@nestjs/graphql';
import { CommentWhereInput } from './comment-where-input';
import { CommentOrderBy } from './comment-order-by';
import { ConnectionArgs } from '@modules/shared/graphql/relay';

@ArgsType()
export class CommentConnectionArgs extends ConnectionArgs {
    @Field(() => CommentWhereInput, { nullable: true })
    where?: CommentWhereInput;

    @Field(() => CommentOrderBy, { nullable: true })
    orderBy?: CommentOrderBy;
}
