import { Exclude, Expose } from 'class-transformer';

export class CreateAnswerCommand {
    @Expose()
    text: string;

    @Expose()
    questionId: string;

    @Exclude()
    userId?: string;
}
