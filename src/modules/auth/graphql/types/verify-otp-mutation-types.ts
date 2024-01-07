import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class VerifyOtpInput {
    @IsNotEmpty()
    @Field()
    token: string;

    @IsNotEmpty()
    @Field()
    code: string;
}

@ObjectType()
export class VerifyOtpPayload {
    @Field()
    token: string;
}
