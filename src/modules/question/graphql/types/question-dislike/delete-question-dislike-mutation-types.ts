import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteQuestionDislikeInput {
    @IsNotEmpty()
    @Field()
    questionId: string;
}

@ObjectType()
export class DeleteQuestionDislikePayload {
    @Field()
    dislikeCount: number;
}
