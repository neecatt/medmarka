import { Expose } from 'class-transformer';
import { PermissionInput } from '../../graphql/types/create-role-mutation-types';

export class CreateRoleCommand {
    @Expose()
    name: string;

    @Expose()
    permissions: PermissionInput[];
}
