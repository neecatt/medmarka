import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UserPermissionWhereInput {
    @IsNotEmpty()
    @Field()
    userId: string;

    @Field(() => Boolean, { defaultValue: false })
    isGetAll: boolean;
}
