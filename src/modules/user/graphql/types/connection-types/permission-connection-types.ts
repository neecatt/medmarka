import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';
import { PermissionName } from '@modules/user/domain/enums/permission-name';

@ObjectType('Permission', { implements: RelayNode })
export class PermissionNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field(() => PermissionName)
    name: PermissionName;

    @Field()
    description: string;

    @Field(() => Date)
    createdAt: Date;
}

@ObjectType()
export class PermissionEdge extends EdgeType(PermissionNode) {}

@ObjectType()
export class PermissionConnection extends ConnectionType(PermissionNode, PermissionEdge) {}
