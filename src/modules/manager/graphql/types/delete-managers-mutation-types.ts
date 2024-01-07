import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteManagersInput {
    @Field(() => [String])
    ids: string[];
}
