import { Expose } from 'class-transformer';

export class UnBlockAnswerCommand {
    @Expose()
    answerId: string;
}
