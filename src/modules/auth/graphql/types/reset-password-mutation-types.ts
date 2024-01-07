import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ResetPasswordInput {
    @IsNotEmpty()
    @Field()
    token: string;

    @IsNotEmpty()
    @Field()
    password: string;
}

@ObjectType()
export class ResetPasswordPayload {
    @Field()
    success: boolean;
}
