import { Exclude, Expose } from 'class-transformer';

export class DeleteAnswerDislikeCommand {
    @Expose()
    answerId: string;

    @Exclude()
    userId: string;
}
