import { Expose } from 'class-transformer';
import { FileUpload } from 'graphql-upload';

export class UploadUserAvatarCommand {
    @Expose()
    readonly avatar: Promise<FileUpload>;

    userId: string;
}
