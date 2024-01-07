import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { PatientNode } from './patient-connection-types';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class UpdatePatientByAdminInput {
    @IsNotEmpty()
    @Field()
    firstName: string;

    @IsNotEmpty()
    @Field()
    lastName: string;

    @IsNotEmpty()
    @Field()
    email: string;

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

@ObjectType()
export class UpdatePatientByAdminPayload {
    @Field(() => PatientNode)
    patient: PatientNode;
}
