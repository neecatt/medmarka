import { ArgsType, Field } from '@nestjs/graphql';
import { PatientWhereInput } from './patient-where-input';
import { PatientOrderBy } from './patient-order-by';
import { ConnectionArgs } from '@modules/shared/graphql/relay';

@ArgsType()
export class PatientConnectionArgs extends ConnectionArgs {
    @Field(() => PatientWhereInput, { nullable: true })
    where?: PatientWhereInput;

    @Field(() => PatientOrderBy, { nullable: true })
    orderBy?: PatientOrderBy;
}
