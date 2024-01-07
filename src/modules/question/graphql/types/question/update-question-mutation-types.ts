import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { QuestionNode } from './question-connection-types';

@InputType()
export class UpdateQuestionInput {
    @Field(() => ID)
    id: string;

    @IsNotEmpty()
    @Field()
    title: string;

    @IsNotEmpty()
    @Field()
    body: string;
}

@ObjectType()
export class UpdateQuestionPayload {
    @Field(() => QuestionNode)
    question: QuestionNode;
}
