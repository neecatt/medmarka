import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('comment', { implements: RelayNode })
export class CommentNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    text: string;

    @Field()
    questionId: string;

    @Field()
    answerId: string;

    @Field()
    createdAt: Date;
}

@ObjectType()
export class CommentEdge extends EdgeType(CommentNode) {}

@ObjectType()
export class CommentConnection extends ConnectionType(CommentNode, CommentEdge) {}
