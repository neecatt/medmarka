import { Expose } from 'class-transformer';

export class UpdateAnswerCommand {
    @Expose()
    id: string;

    @Expose()
    text: string;

    userId: string;
}
