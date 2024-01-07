import { Expose } from 'class-transformer';

export class BlockAnswerCommand {
    @Expose()
    answerId: string;
}
