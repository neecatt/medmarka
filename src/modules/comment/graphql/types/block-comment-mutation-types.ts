import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CommentStatus } from '@modules/comment/domain/enums/comment-status';

@InputType()
export class BlockCommentInput {
    @IsNotEmpty()
    @Field()
    commentId: string;
}

@ObjectType()
export class BlockCommentPayload {
    @Field()
    status: CommentStatus;
}
