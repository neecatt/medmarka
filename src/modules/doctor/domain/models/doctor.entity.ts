import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { Profession } from '../enums/profession';
import { Degree } from '../enums/degree';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';
import { User } from '@modules/user/domain/models/user.entity';

@Entity({ name: 'doctors' })
export class Doctor implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ type: 'enum', enum: Profession })
    profession: Profession;

    @Column({ type: 'enum', enum: Degree })
    degree: Degree;

    @Column()
    title: string;

    @Column()
    organization: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
    deletedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
