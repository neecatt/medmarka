import { ArgsType, Field } from '@nestjs/graphql';
import { TagWhereInput } from './tag-where-input';
import { TagOrderBy } from './tag-order-by';
import { ConnectionArgs } from '@modules/shared/graphql/relay';

@ArgsType()
export class TagConnectionArgs extends ConnectionArgs {
    @Field(() => TagWhereInput, { nullable: true })
    where?: TagWhereInput;

    @Field(() => TagOrderBy, { nullable: true })
    orderBy?: TagOrderBy;
}
