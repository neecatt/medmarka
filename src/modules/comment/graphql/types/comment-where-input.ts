import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommentWhereInput {
    @Field({ nullable: true })
    text: string;

    @Field({ nullable: true })
    keyword: string;
}
