import { Exclude, Expose } from 'class-transformer';

export class DeleteAnswerLikeCommand {
    @Expose()
    answerId: string;

    @Exclude()
    userId: string;
}
