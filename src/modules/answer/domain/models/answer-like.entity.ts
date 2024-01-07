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
import { Answer } from '@modules/answer/domain/models/answer.entity';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';
import { User } from '@modules/user/domain/models/user.entity';

@Entity({ name: 'answer_likes' })
export class AnswerLike implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'answer_id' })
    answerId: string;

    @ManyToOne(() => Answer)
    @JoinColumn({ name: 'answer_id' })
    answer: Answer;

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
