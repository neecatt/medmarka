import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { QuestionStatus } from '@modules/question/domain/enums/question-status';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('question', { implements: RelayNode })
export class QuestionNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @IsNotEmpty()
    @Field({ nullable: true })
    patientId: string;

    @Field({ nullable: true })
    likeCount: number;

    @Field({ nullable: true })
    dislikeCount: number;

    @IsNotEmpty()
    @Field()
    title: string;

    @Field(() => QuestionStatus)
    status: QuestionStatus;

    @IsNotEmpty()
    @Field()
    body: string;

    @Field()
    createdAt: Date;
}

@ObjectType()
export class QuestionEdge extends EdgeType(QuestionNode) {}

@ObjectType()
export class QuestionConnection extends ConnectionType(QuestionNode, QuestionEdge) {}
