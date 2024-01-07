import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteQuestionLikeInput {
    @IsNotEmpty()
    @Field()
    questionId: string;
}

@ObjectType()
export class DeleteQuestionLikePayload {
    @Field()
    likeCount: number;
}
