import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DislikeAnswerInput {
    @IsNotEmpty()
    @Field()
    answerId: string;
}

@ObjectType()
export class DislikeAnswerPayload {
    @Field()
    dislikeCount: number;
}
