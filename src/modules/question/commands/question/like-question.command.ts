import { Exclude, Expose } from 'class-transformer';

export class LikeQuestionCommand {
    @Expose()
    readonly questionId: string;

    @Exclude()
    userId: string;
}
