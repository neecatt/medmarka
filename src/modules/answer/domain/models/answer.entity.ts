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
import { AnswerStatus } from '../enums/answer-status';
import { Question } from '@modules/question/domain/models/question.entity';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';
import { User } from '@modules/user/domain/models/user.entity';

@Entity({ name: 'answers' })
export class Answer implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', nullable: true })
    userId?: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @Column({ type: 'text' })
    text: string;

    @Column({ name: 'question_id' })
    questionId: string;

    @Column({ default: 1 })
    index: number;

    @ManyToOne(() => Question)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column({ type: 'enum', enum: AnswerStatus, default: AnswerStatus.PUBLISHED })
    status: AnswerStatus;

    @Column({ name: 'like_count', default: 0 })
    likeCount: number;

    @Column({ name: 'dislike_count', default: 0 })
    dislikeCount: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
    deletedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
