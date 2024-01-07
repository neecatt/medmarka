import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteAnswersInput {
    @Field(() => [String])
    ids: string[];
}
