import { Exclude, Expose } from 'class-transformer';

export class LikeAnswerCommand {
    @Expose()
    readonly answerId: string;

    @Exclude()
    userId: string;
}
