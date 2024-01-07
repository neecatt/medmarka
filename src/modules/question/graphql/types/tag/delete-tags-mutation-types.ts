import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteTagsInput {
    @Field(() => [String])
    ids: string[];
}
