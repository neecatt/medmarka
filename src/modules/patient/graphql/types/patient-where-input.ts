import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PatientWhereInput {
    @Field({ nullable: true })
    firstName?: string;
    @Field({ nullable: true })
    lastName?: string;
    @Field({ nullable: true })
    email?: string;
    @Field({ nullable: true })
    role?: string;
}
