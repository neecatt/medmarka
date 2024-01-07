import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Gender } from '@modules/user/domain/enums/gender';
import { Profession } from '@modules/doctor/domain/enums/profession';
import { Degree } from '@modules/doctor/domain/enums/degree';

@InputType()
export class RegisterDoctorInput {
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

    @Field()
    @IsNotEmpty()
    @IsPhoneNumber('AZ')
    phoneNumber: string;

    @Field({ nullable: true })
    dateOfBirth?: Date;

    @Field(() => Gender, { nullable: true })
    gender?: Gender;

    @Field({ nullable: true })
    address?: string;

    @Field(() => Profession)
    @IsNotEmpty()
    @IsEnum(Profession)
    profession: Profession;

    @Field(() => Degree)
    @IsNotEmpty()
    @IsEnum(Degree)
    degree: Degree;

    @IsNotEmpty()
    @IsString()
    @Field()
    title: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    organization: string;
}

@ObjectType()
export class RegisterDoctorPayload {
    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    token?: string;
}
