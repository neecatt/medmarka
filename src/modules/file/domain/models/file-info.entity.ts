import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { BlurhashMeta } from '../types/uploaded-file-info';
import { IEditableEntity } from '@modules/shared/domain/interfaces';

@Entity({ name: 'files' })
export class FileInfo implements IEditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    objectName?: string;

    @Index()
    @Column()
    name: string;

    @Index({ unique: true })
    @Column()
    url: string;

    @Column({ type: 'jsonb', nullable: true })
    blurhash?: BlurhashMeta;

    @Column()
    size: number;

    @Index()
    @Column()
    extension: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
