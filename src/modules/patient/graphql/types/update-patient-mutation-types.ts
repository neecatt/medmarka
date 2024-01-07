import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { PatientNode } from './patient-connection-types';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class UpdatePatientInput {
    @IsNotEmpty()
    @Field()
    firstName: string;

    @IsNotEmpty()
    @Field()
    lastName: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field({ nullable: true })
    dateOfBirth?: Date;

    @Field(() => Gender)
    gender: Gender;

    @Field({ nullable: true })
    address?: string;
}

@ObjectType()
export class UpdatePatientPayload {
    @Field(() => PatientNode)
    patient: PatientNode;
}
