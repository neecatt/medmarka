import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { QuestionNode } from './question-connection-types';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateQuestionInput {

    @IsNotEmpty()
    @Field()
    title: string;

    @IsNotEmpty()
    @Field()
    body: string;

    @Field(() => [String])
    tagNames: string[];

    @Field(() => [GraphQLUpload], { nullable: true })
    images?: Promise<FileUpload>[];
}

@ObjectType()
export class CreateQuestionPayload {
    @Field(() => QuestionNode)
    question: QuestionNode;
}
