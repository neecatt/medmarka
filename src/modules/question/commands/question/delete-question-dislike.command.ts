import { Exclude, Expose } from 'class-transformer';

export class DeleteQuestionDislikeCommand {
    @Expose()
    questionId: string;

    @Exclude()
    userId: string;
}
