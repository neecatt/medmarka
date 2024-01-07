import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { QuestionStatus } from '@modules/question/domain/enums/question-status';

@InputType()
export class UnBlockQuestionInput {
    @IsNotEmpty()
    @Field()
    questionId: string;
}

@ObjectType()
export class UnBlockQuestionPayload {
    @Field()
    status: QuestionStatus;
}
