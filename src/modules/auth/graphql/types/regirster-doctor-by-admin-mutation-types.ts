import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Degree } from '@modules/doctor/domain/enums/degree';
import { Profession } from '@modules/doctor/domain/enums/profession';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class RegisterDoctorByAdminInput {
    @IsNotEmpty()
    @Field()
    firstName: string;

    @IsNotEmpty()
    @Field()
    lastName: string;

    @IsNotEmpty()
    @Field()
    email: string;

    @IsNotEmpty()
    @Field()
    password: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field()
    dateOfBirth: Date;

    @Field(() => Gender)
    gender: Gender;

    @Field({ nullable: true })
    address?: string;

    @Field({ nullable: true })
    emailVerified?: boolean;

    @Field({ nullable: true })
    isVerified?: boolean;

    @Field(() => Profession)
    profession: Profession;

    @Field(() => Degree)
    degree: Degree;

    @IsNotEmpty()
    @Field()
    title: string;

    @IsNotEmpty()
    @Field()
    organization: string;
}
