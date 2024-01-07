import { Expose } from 'class-transformer';

export class BlockCommentCommand {
    @Expose()
    commentId: string;
}
