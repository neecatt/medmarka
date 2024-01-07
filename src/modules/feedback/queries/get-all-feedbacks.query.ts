import { FeedbackConnectionArgs } from '../graphql/types/feedback-connection-args';

export class GetAllFeedbacksQuery {
    constructor(public readonly connectionArgs: FeedbackConnectionArgs) {}
}
