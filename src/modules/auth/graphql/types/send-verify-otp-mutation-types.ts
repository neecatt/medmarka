import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SendVerifyOtpInput {
    @IsNotEmpty()
    @Field()
    email: string;
}

@ObjectType()
export class SendVerifyOtpPayload {
    @Field()
    token: string;
}
