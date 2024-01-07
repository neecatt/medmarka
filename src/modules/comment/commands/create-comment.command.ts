import { Exclude, Expose } from 'class-transformer';

export class CreateCommentCommand {
    @Expose()
    text: string;

    @Expose()
    questionId: string;

    @Expose()
    answerId: string;

    @Exclude()
    userId?: string;
}
