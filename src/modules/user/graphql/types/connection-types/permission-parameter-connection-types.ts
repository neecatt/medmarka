import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';
import { PermissionParameterValue } from '@modules/user/domain/enums/permission-parameter-value';
import { PermissionParameterType } from '@modules/user/domain/enums/permission-parameter-type';

@ObjectType('PermissionParameter', { implements: RelayNode })
export class PermissionParameterNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    description: string;

    @Field()
    permissionId: string;

    @Field(() => PermissionParameterValue)
    value: PermissionParameterValue;

    @Field(() => PermissionParameterType)
    type: PermissionParameterType;

    @Field(() => Date)
    createdAt: Date;
}

@ObjectType()
export class PermissionParameterEdge extends EdgeType(PermissionParameterNode) {}

@ObjectType()
export class PermissionParameterConnection extends ConnectionType(PermissionParameterNode, PermissionParameterEdge) {}
