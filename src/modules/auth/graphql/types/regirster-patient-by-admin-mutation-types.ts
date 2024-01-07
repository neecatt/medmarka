import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class RegisterPatientByAdminInput {
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
}
