import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AllowedSettingValue {
    @Field()
    label: string;

    @Field()
    value: string;
}
