import { Expose } from 'class-transformer';

export class UnBlockQuestionCommand {
    @Expose()
    questionId: string;
}
