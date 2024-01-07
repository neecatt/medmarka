import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('User', { implements: RelayNode })
export class UserNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field({ nullable: true })
    emailVerified?: boolean;
}

@ObjectType()
export class UserEdge extends EdgeType(UserNode) {}

@ObjectType()
export class UserConnection extends ConnectionType(UserNode, UserEdge) {}
