import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('Patient', { implements: RelayNode })
export class PatientNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    showProfile: boolean;

    @Field()
    userId: string;

    @Field()
    createdAt: Date;
}

@ObjectType()
export class PatientEdge extends EdgeType(PatientNode) {}

@ObjectType()
export class PatientConnection extends ConnectionType(PatientNode, PatientEdge) {}
