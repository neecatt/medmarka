import { Exclude, Expose } from 'class-transformer';

export class DislikeQuestionCommand {
    @Expose()
    readonly questionId: string;

    @Exclude()
    userId: string;
}
