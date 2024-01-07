import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteAnswerDislikeInput {
    @IsNotEmpty()
    @Field()
    answerId: string;
}

@ObjectType()
export class DeleteAnswerDislikePayload {
    @Field()
    dislikeCount: number;
}
