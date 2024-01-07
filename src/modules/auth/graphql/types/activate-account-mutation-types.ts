import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ActivateAccountInput {
    @IsNotEmpty()
    @Field()
    token: string;
}

@ObjectType()
export class ActivateAccountPayload {
    @Field()
    success: boolean;
}
