import { QuestionConnectionArgs } from '@modules/question/graphql/types/question/question-connection-args';

export class GetAllQuestionsQuery {
    constructor(public readonly questionConnectionArgs: QuestionConnectionArgs) {}
}
