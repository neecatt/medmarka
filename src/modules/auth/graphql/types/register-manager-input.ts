import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class RegisterManagerInput {
    @IsNotEmpty()
    @Field()
    firstName: string;

    @IsNotEmpty()
    @Field()
    lastName: string;

    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @Field()
    password: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field(() => Gender)
    gender: Gender;

    @Field(() => [String])
    roleIds: string[];
}
