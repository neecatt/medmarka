import { UserPermissionConnectionArgs } from '../../graphql/types/user-permission-connection-args';

export class GetAllUserPermisionsQuery {
    constructor(public readonly connectionArgs: UserPermissionConnectionArgs) {}
}
