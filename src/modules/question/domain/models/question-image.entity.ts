import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';
import { Question } from './question.entity';
import { FileInfo } from '@modules/file/domain/models/file-info.entity';

@Entity({ name: 'question_images' })
export class QuestionImage implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'question_id' })
    questionId: string;

    @ManyToOne(() => Question)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column({ name: 'file_id' })
    fileId: string;

    @ManyToOne(() => FileInfo, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn({ name: 'file_id' })
    file: FileInfo;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
    deletedAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
