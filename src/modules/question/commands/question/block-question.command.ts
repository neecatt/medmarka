import { Expose } from 'class-transformer';

export class BlockQuestionCommand {
    @Expose()
    questionId: string;
}
