import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ForgotPasswordInput {
    @IsNotEmpty()
    @Field()
    email: string;
}

@ObjectType()
export class ForgotPasswordPayload {
    @Field()
    sent: boolean;
}
