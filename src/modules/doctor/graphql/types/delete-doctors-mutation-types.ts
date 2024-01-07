import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteDoctorsInput {
    @Field(() => [String])
    ids: string[];
}
