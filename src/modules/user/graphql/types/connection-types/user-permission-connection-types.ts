import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('UserPermission', { implements: RelayNode })
export class UserPermissionNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    permissionId: string;

    @Field(() => Date)
    createdAt: Date;
}

@ObjectType()
export class UserPermissionEdge extends EdgeType(UserPermissionNode) {}

@ObjectType()
export class UserPermissionConnection extends ConnectionType(UserPermissionNode, UserPermissionEdge) {}
