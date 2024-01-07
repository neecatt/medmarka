import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ManagerNode } from './manager-connection-types';
import { Gender } from '@modules/user/domain/enums/gender';

@InputType()
export class UpdateManagerInput {
    @IsNotEmpty()
    @Field()
    readonly firstName: string;

    @IsNotEmpty()
    @Field()
    readonly lastName: string;

    @IsNotEmpty()
    @Field()
    readonly phoneNumber: string;

    @Field({ nullable: true })
    readonly jobTitle?: string;

    @Field({ nullable: true })
    readonly dateOfBirth?: Date;

    @Field({ nullable: true })
    readonly gender?: Gender;
}

@ObjectType()
export class UpdateManagerPayload {
    @Field(() => ManagerNode)
    manager: ManagerNode;
}
