import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteAnswerLikeInput {
    @IsNotEmpty()
    @Field()
    answerId: string;
}

@ObjectType()
export class DeleteAnswerLikePayload {
    @Field()
    likeCount: number;
}
