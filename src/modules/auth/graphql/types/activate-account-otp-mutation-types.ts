import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ActivateAccountOtpInput {
    @IsNotEmpty()
    @Field()
    token: string;

    @IsNotEmpty()
    @Field()
    otp: string;
}

@ObjectType()
export class ActivateAccountOtpPayload {
    @Field()
    success: boolean;
}
