import { ArgsType, Field } from '@nestjs/graphql';
import { ManagerWhereInput } from './manager-where-input';
import { ManagerOrderBy } from './manager-order-by';
import { ConnectionArgs } from '@modules/shared/graphql/relay';

@ArgsType()
export class ManagerConnectionArgs extends ConnectionArgs {
    @Field(() => ManagerWhereInput, { nullable: true })
    where?: ManagerWhereInput;

    @Field(() => ManagerOrderBy, { nullable: true })
    orderBy?: ManagerOrderBy;
}
