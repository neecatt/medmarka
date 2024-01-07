import { TagConnectionArgs } from '@modules/question/graphql/types/tag/tag-connection-args';

export class GetAllTagsQuery {
    constructor(public readonly tagConnectionArgs: TagConnectionArgs) {}
}
