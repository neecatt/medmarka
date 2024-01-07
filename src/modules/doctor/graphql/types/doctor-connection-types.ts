import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';
import { Profession } from '@modules/doctor/domain/enums/profession';
import { Degree } from '@modules/doctor/domain/enums/degree';

@ObjectType('doctor', { implements: RelayNode })
export class DoctorNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    isVerified: boolean;

    @Field()
    isBlocked: boolean;

    @Field(() => Profession)
    profession: Profession;

    @Field(() => Degree)
    degree: Degree;

    @Field()
    title: string;

    @Field()
    organization: string;

    @Field()
    createdAt: Date;
}

@ObjectType()
export class DoctorEdge extends EdgeType(DoctorNode) {}

@ObjectType()
export class DoctorConnection extends ConnectionType(DoctorNode, DoctorEdge) {}
