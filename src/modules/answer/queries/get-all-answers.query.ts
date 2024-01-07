import { AnswerConnectionArgs } from '../graphql/types/answer-connection-args';

export class GetAllAnswersQuery {
    constructor(public readonly answerConnectionArgs: AnswerConnectionArgs) {}
}
