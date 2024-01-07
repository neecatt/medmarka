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
import { FeedbackType } from '../enums/feedback-type';
import { FeedbackDecision } from '../enums/feedback-decision';
import { FeedbackSource } from '../enums/feedback-source-type';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';
import { User } from '@modules/user/domain/models/user.entity';

@Entity({ name: 'feedbacks' })
export class Feedback implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: FeedbackType })
    reason: FeedbackType;

    @Column({ name: 'custom_reason', length: 100, nullable: true })
    customReason?: string;

    @Column({ type: 'enum', enum: FeedbackSource })
    source: FeedbackSource;

    @Column({ name: 'source_id' })
    sourceId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', nullable: true })
    userId?: string;

    @Column({ type: 'enum', enum: FeedbackDecision, default: FeedbackDecision.PENDING })
    decision: FeedbackDecision;

    @Column({ type: Boolean, name: 'is_read', default: false })
    isRead: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
    deletedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
