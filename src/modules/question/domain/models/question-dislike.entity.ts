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
import { Question } from './question.entity';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';
import { User } from '@modules/user/domain/models/user.entity';

@Entity({ name: 'question_dislikes' })
export class QuestionDislike implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'question_id' })
    questionId: string;

    @ManyToOne(() => Question)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
    deletedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
