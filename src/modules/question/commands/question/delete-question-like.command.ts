import { Exclude, Expose } from 'class-transformer';

export class DeleteQuestionLikeCommand {
    @Expose()
    questionId: string;

    @Exclude()
    userId: string;
}
