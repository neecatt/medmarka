import { Expose } from 'class-transformer';

export class MarkAsReadCommand {
    @Expose()
    id: string;

    @Expose()
    isRead: boolean;
}
