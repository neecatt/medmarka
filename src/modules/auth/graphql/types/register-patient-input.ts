import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class RegisterPatientInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @Field()
    password: string;

    @IsNotEmpty()
    @IsPhoneNumber('AZ')
    @Field()
    phoneNumber: string;

    @Field({ nullable: true })
    dateOfBirth?: Date;

    @Field(() => Gender, { nullable: true })
    gender?: Gender;

    @Field({ nullable: true })
    address?: string;
}

@ObjectType()
export class RegisterPatientPayload {
    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    token?: string;
}
