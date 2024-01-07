import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ManagerNode } from './manager-connection-types';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class UpdateManagerByAdminInput {
    @Field(() => ID)
    id: string;

    @IsNotEmpty()
    @Field()
    readonly firstName: string;

    @IsNotEmpty()
    @Field()
    readonly lastName: string;

    @IsEmail()
    @Field()
    readonly email: string;

    @IsNotEmpty()
    @Field()
    readonly phoneNumber: string;

    @Field({ nullable: true })
    readonly jobTitle?: string;

    @Field({ nullable: true })
    readonly dateOfBirth?: Date;

    @Field({ nullable: true })
    readonly gender?: Gender;

    @Field(() => [String])
    readonly roleIds: string[];
}

@ObjectType()
export class UpdateManagerByAdminPayload {
    @Field(() => ManagerNode)
    manager: ManagerNode;
}
