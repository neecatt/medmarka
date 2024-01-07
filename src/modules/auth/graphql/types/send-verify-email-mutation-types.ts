import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SendVerifyEmailInput {
    @IsNotEmpty()
    @Field()
    email: string;
}

@ObjectType()
export class SendVerifyEmailPayload {
    @Field()
    sent: boolean;
}
