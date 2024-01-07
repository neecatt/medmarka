import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TagWhereInput {
    @Field({ nullable: true })
    name?: string;
}
