import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeletePatientsInput {
    @Field(() => [String])
    ids: string[];
}
