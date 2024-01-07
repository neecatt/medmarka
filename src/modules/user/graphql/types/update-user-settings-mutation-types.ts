import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UpdateUserSettingInput } from './update-user-setting-input';

@InputType()
export class UpdateUserSettingsInput {
    @Field(() => [UpdateUserSettingInput])
    settings: UpdateUserSettingInput[];
}

@ObjectType()
export class UpdateUserSettingsPayload {
    @Field()
    result: boolean;
}
