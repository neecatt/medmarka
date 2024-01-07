import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('Manager', { implements: RelayNode })
export class ManagerNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    createdAt: Date;

    @Field()
    userId?: string;

    @Field({ nullable: true })
    avatarId?: string;

    @Field({ nullable: true })
    jobTitle?: string;
}

@ObjectType()
export class ManagerEdge extends EdgeType(ManagerNode) {}

@ObjectType()
export class ManagerConnection extends ConnectionType(ManagerNode, ManagerEdge) {}
