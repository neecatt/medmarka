import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { DoctorNode } from './doctor-connection-types';
import { Degree } from '@modules/doctor/domain/enums/degree';
import { Profession } from '@modules/doctor/domain/enums/profession';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class UpdateDoctorByAdminInput {
    @Field(() => ID)
    doctorId: string;

    @IsNotEmpty()
    @Field()
    firstName: string;

    @IsNotEmpty()
    @Field()
    lastName: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field()
    dateOfBirth: Date;

    @Field(() => Gender)
    gender: Gender;

    @Field({ nullable: true })
    address?: string;

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

@ObjectType()
export class UpdateDoctorByAdminPayload {
    @Field(() => DoctorNode)
    doctor: DoctorNode;
}
