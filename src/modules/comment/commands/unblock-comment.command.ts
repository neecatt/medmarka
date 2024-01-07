import { Expose } from 'class-transformer';

export class UnBlockCommentCommand {
    @Expose()
    commentId: string;
}
