import { Exclude, Expose } from 'class-transformer';

export class DislikeAnswerCommand {
    @Expose()
    readonly answerId: string;

    @Exclude()
    userId: string;
}
