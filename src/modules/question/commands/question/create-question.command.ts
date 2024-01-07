import { Expose } from 'class-transformer';
import { FileUpload } from 'graphql-upload';

export class CreateQuestionCommand {
    patientId: string;

    @Expose()
    title: string;

    @Expose()
    body: string;

    @Expose()
    tagNames: string[];

    @Expose()
    images?: Promise<FileUpload>[];
}
