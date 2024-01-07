import { ArgsType, Field } from '@nestjs/graphql';
import { DoctorWhereInput } from './doctor-where-input';
import { DoctorOrderBy } from './doctor-order-by';
import { ConnectionArgs } from '@modules/shared/graphql/relay';

@ArgsType()
export class DoctorConnectionArgs extends ConnectionArgs {
    @Field(() => DoctorWhereInput, { nullable: true })
    where?: DoctorWhereInput;

    @Field(() => DoctorOrderBy, { nullable: true })
    orderBy?: DoctorOrderBy;
}
