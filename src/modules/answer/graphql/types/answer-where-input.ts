import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AnswerWhereInput {
    @Field({ nullable: true })
    text?: string;

    @Field({ nullable: true })
    keyword?: string;
}
