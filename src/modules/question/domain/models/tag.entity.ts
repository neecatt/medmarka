import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';

@Entity({ name: 'tags' })
export class Tag implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ name: 'usage_count', type: 'int', default: 0 })
    usageCount: number;

    @Column({ name: 'is_auto_created', default: false })
    isAutoCreated: boolean;

    @ManyToMany(() => Question, (question) => question.tags)
    questions: Question[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
    deletedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
