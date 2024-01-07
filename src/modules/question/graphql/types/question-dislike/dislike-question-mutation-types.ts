import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DislikeQuestionInput {
    @IsNotEmpty()
    @Field()
    questionId: string;
}

@ObjectType()
export class DislikeQuestionPayload {
    @Field()
    dislikeCount: number;
}
