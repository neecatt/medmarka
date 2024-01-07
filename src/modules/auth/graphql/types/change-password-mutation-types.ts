import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ChangePasswordInput {
    @IsNotEmpty()
    @Field()
    currentPassword: string;

    @IsNotEmpty()
    @Field()
    newPassword: string;
}

@ObjectType()
export class ChangePasswordPayload {
    @Field()
    success: boolean;
}
