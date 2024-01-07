import { CommentConnectionArgs } from '../graphql/types/comment-connection-args';

export class GetAllCommentsQuery {
    constructor(public readonly commentConnectionArgs: CommentConnectionArgs) {}
}
