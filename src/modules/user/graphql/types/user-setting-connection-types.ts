import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';

@ObjectType('UserSetting', { implements: RelayNode })
export class UserSettingNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    settingId: string;

    @Field({ nullable: true })
    value?: string;
}

@ObjectType()
export class UserSettingEdge extends EdgeType(UserSettingNode) {}

@ObjectType()
export class UserSettingConnection extends ConnectionType(UserSettingNode, UserSettingEdge) {}
