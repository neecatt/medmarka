import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LikeQuestionInput {
    @IsNotEmpty()
    @Field()
    questionId: string;
}

@ObjectType()
export class LikeQuestionPayload {
    @Field()
    likeCount: number;
}
