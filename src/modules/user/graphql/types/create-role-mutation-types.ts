import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { RoleNode } from './connection-types/role-connection-types';

@InputType()
export class CreateRoleInput {
    @IsNotEmpty()
    @Field()
    name: string;

    @Field(() => [PermissionInput])
    permissions: PermissionInput[];
}

@ObjectType()
export class CreateRolePayload {
    @Field(() => RoleNode)
    role: RoleNode;
}

@InputType()
export class PermissionInput {
    @IsNotEmpty()
    @Field()
    permissionId: string;

    @IsNotEmpty()
    @Field()
    parameterId: string;
}
