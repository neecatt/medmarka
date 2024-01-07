import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('Role', { implements: RelayNode })
export class RoleNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;
}

@ObjectType()
export class RoleEdge extends EdgeType(RoleNode) {}

@ObjectType()
export class RoleConnection extends ConnectionType(RoleNode, RoleEdge) {}
