import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { AnswerStatus } from '@modules/answer/domain/enums/answer-status';

@InputType()
export class UnBlockAnswerInput {
    @IsNotEmpty()
    @Field()
    answerId: string;
}

@ObjectType()
export class UnBlockAnswerPayload {
    @Field()
    status: AnswerStatus;
}
