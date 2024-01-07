import {
    CreateDateColumn,
    DeleteDateColumn,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
    Index,
} from 'typeorm';
import { CommentStatus } from '../enums/comment-status';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';
import { User } from '@modules/user/domain/models/user.entity';
import { Question } from '@modules/question/domain/models/question.entity';
import { Answer } from '@modules/answer/domain/models/answer.entity';

@Entity({ name: 'comments' })
@Index(['questionId', 'text', 'userId'], { unique: true })
@Index(['answerId', 'text', 'userId'], { unique: true })
export class Comment implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', nullable: true })
    userId?: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text' })
    text: string;

    @Column({ name: 'question_id' })
    questionId: string;

    @ManyToOne(() => Question)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column({ name: 'answer_id' })
    answerId: string;

    @ManyToOne(() => Answer)
    @JoinColumn({ name: 'answer_id' })
    answer: Answer;

    @Column({ type: 'enum', enum: CommentStatus, default: CommentStatus.PUBLISHED })
    status: CommentStatus;

    @Column({ name: 'like_count', default: 0 })
    likeCount: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
    deletedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
