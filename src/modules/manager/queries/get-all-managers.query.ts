import { ManagerConnectionArgs } from '../graphql/types/manager-connection-args';

export class GetAllManagersQuery {
    constructor(public readonly managerConnectionArgs: ManagerConnectionArgs) {}
}
