import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('RolePermission', { implements: RelayNode })
export class RolePermissionNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    roleId: string;

    @Field()
    permissionId: string;

    @Field()
    parameterId: string;

    @Field(() => Date)
    createdAt: Date;
}

@ObjectType()
export class RolePermissionEdge extends EdgeType(RolePermissionNode) {}

@ObjectType()
export class RolePermissionConnection extends ConnectionType(RolePermissionNode, RolePermissionEdge) {}
