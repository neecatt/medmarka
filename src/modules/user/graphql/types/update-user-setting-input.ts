import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserSettingInput {
    @IsNotEmpty()
    @Field()
    settingId: string;

    @IsNotEmpty()
    @Field()
    value: string;
}
