import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class CompleteSocialRegistrationInput {
    @IsNotEmpty()
    @Field()
    idFin: string;

    @IsNotEmpty()
    @Field()
    idSerialNumber: string;

    @IsNotEmpty()
    @Field()
    phoneNumber: string;

    @IsNotEmpty()
    @Field()
    dateOfBirth: Date;

    @Field(() => Gender)
    gender: Gender;

    @IsNotEmpty()
    @Field()
    address: string;

    @IsNotEmpty()
    @Field()
    branchId: string;
}
