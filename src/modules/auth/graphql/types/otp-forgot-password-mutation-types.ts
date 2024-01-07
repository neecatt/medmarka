import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class OtpForgotPasswordInput {
    @IsNotEmpty()
    @Field()
    email: string;
}

@ObjectType()
export class OtpForgotPasswordPayload {
    @Field()
    token: string;
}
