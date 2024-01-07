import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CommentNode } from './comment-connection-types';

@InputType()
export class UpdateCommentInput {
    @IsNotEmpty()
    @Field()
    id: string;

    @IsNotEmpty()
    @Field()
    text: string;
}

@ObjectType()
export class UpdateCommentPayload {
    @Field(() => CommentNode)
    comment: CommentNode;
}
