import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UpdateCommentCommand {
    @Expose()
    @IsNotEmpty()
    id: string;

    @Expose()
    @IsNotEmpty()
    text: string;

    @Exclude()
    userId: string;
}
