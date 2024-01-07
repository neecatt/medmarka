import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { RoleNode } from './connection-types/role-connection-types';
import { PermissionInput } from './create-role-mutation-types';

@InputType()
export class UpdateRoleInput {
    @IsNotEmpty()
    @Field()
    id: string;

    @IsNotEmpty()
    @Field()
    name: string;

    @Field(() => [PermissionInput])
    permissions: PermissionInput[];
}

@ObjectType()
export class UpdateRolePayload {
    @Field(() => RoleNode)
    role: RoleNode;
}
