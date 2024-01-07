import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteQuestionsInput {
    @Field(() => [String])
    ids: string[];
}
