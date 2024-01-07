import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';
import { AnswerStatus } from '@modules/answer/domain/enums/answer-status';

@ObjectType('answer', { implements: RelayNode })
export class AnswerNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    text: string;

    @Field()
    questionId: string;

    @Field({ nullable: true })
    likeCount: number;

    @Field({ nullable: true })
    dislikeCount: number;

    @Field()
    createdAt: Date;

    @Field(() => AnswerStatus)
    status: AnswerStatus;
}

@ObjectType()
export class AnswerEdge extends EdgeType(AnswerNode) {}

@ObjectType()
export class AnswerConnection extends ConnectionType(AnswerNode, AnswerEdge) {}
