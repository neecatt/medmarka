import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('QuestionImage', { implements: RelayNode })
export class QuestionImageNode {
    @Field(() => ID)
    id: string;

    @Field()
    questionId: string;

    @Field()
    fileId: string;

    @Field()
    createdAt: Date;
}

@ObjectType()
export class QuestionImageEdge extends EdgeType(QuestionImageNode) { }

@ObjectType()
export class QuestionImageConnection extends ConnectionType(QuestionImageNode, QuestionImageEdge) { }
