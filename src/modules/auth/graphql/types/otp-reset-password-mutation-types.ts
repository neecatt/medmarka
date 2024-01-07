import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class OtpResetPasswordInput {
    @IsNotEmpty()
    @Field()
    token: string;

    @IsNotEmpty()
    @Field()
    password: string;

    @Field()
    code: string;
}

@ObjectType()
export class OtpResetPasswordPayload {
    @Field()
    success: boolean;
}
