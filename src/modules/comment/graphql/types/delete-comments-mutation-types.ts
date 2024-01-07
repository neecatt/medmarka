import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCommentsInput {
    @Field(() => [String])
    ids: string[];
}
