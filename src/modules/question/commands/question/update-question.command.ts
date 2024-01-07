import { Expose } from 'class-transformer';

export class UpdateQuestionCommand {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    body: string;

    patientId: string;
}
