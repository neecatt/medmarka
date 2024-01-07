import { ArgsType, Field } from '@nestjs/graphql';
import { UserPermissionWhereInput } from './user-permission-where-input';
import { ConnectionArgs } from '@modules/shared/graphql/relay';

@ArgsType()
export class UserPermissionConnectionArgs extends ConnectionArgs {
    @Field(() => UserPermissionWhereInput)
    where: UserPermissionWhereInput;
}
