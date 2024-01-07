import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { AnswerStatus } from '@modules/answer/domain/enums/answer-status';

@InputType()
export class BlockAnswerInput {
    @IsNotEmpty()
    @Field()
    answerId: string;
}

@ObjectType()
export class BlockAnswerPayload {
    @Field()
    status: AnswerStatus;
}
