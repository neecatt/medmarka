import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { QuestionStatus } from '../enums/question-status';
import { Tag } from './tag.entity';
import { QuestionImage } from './question-image.entity';
import { Patient } from '@modules/patient/domain/models/patient.entity';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';
import { Answer } from '@modules/answer/domain/models/answer.entity';

@Entity({ name: 'questions' })
export class Question implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'patient_id' })
    patientId: string;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;

    @Column()
    title: string;

    @Column({ type: 'text' })
    body: string;

    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];

    @OneToMany(() => QuestionImage, (image) => image.question, {
        cascade: ['insert', 'update', 'remove'],
        nullable: true,
    })
    images?: QuestionImage[];

    @Column({ type: 'enum', enum: QuestionStatus, default: QuestionStatus.PUBLISHED })
    status: QuestionStatus;

    @Column({ name: 'like_count', default: 0 })
    likeCount: number;

    @Column({ name: 'dislike_count', default: 0 })
    dislikeCount: number;

    @ManyToMany(() => Tag, (tag) => tag.questions, {
        cascade: ['insert', 'update', 'remove'],
    })
    @JoinTable({
        name: 'question_tags',
        joinColumn: {
            name: 'question_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    tags: Tag[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
    deletedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
