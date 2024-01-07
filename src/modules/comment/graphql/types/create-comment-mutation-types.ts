import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CommentNode } from './comment-connection-types';

@InputType()
export class CreateCommentInput {
    @IsNotEmpty()
    @Field()
    text: string;

    @IsNotEmpty()
    @Field()
    questionId: string;

    @IsNotEmpty()
    @Field()
    answerId: string;
}

@ObjectType()
export class CreateCommentPayload {
    @Field(() => CommentNode)
    comment: CommentNode;
}
