import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class QuestionWhereInput {
    @Field({ nullable: true })
    title?: string;

    @Field(() => [String], { nullable: true })
    tags?: string[];

    @Field({ nullable: true })
    keyword?: string;
}
