import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { AnswerNode } from './answer-connection-types';

@InputType()
export class UpdateAnswerInput {
    @IsNotEmpty()
    @Field()
    id: string;

    @IsNotEmpty()
    @Field()
    text: string;
}

@ObjectType()
export class UpdateAnswerPayload {
    @Field(() => AnswerNode)
    answer: AnswerNode;
}
