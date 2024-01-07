import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('tag', { implements: RelayNode })
export class TagNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @IsNotEmpty()
    @Field()
    name: string;

    @Field()
    usageCount: number;

    @Field()
    isAutoCreated: boolean;
}

@ObjectType()
export class TagEdge extends EdgeType(TagNode) {}

@ObjectType()
export class TagConnection extends ConnectionType(TagNode, TagEdge) {}
