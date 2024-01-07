import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LikeAnswerInput {
    @IsNotEmpty()
    @Field()
    answerId: string;
}

@ObjectType()
export class LikeAnswerPayload {
    @Field()
    likeCount: number;
}
