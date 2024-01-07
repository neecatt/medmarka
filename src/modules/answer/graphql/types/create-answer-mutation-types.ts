import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { AnswerNode } from './answer-connection-types';

@InputType()
export class CreateAnswerInput {
    @IsNotEmpty()
    @Field()
    questionId: string;

    @IsNotEmpty()
    @Field()
    text: string;
}

@ObjectType()
export class CreateAnswerPayload {
    @Field(() => AnswerNode)
    answer: AnswerNode;
}
