import { Expose } from 'class-transformer';

export class CreateTagCommand {
    @Expose()
    name: string;

    @Expose()
    usageCount?: number;

    @Expose()
    isAutoCreated?: boolean;
}
