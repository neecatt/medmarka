import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { Gender } from '../enums/gender';
import { User } from './user.entity';
import { IEditableEntity } from '@modules/shared/domain/interfaces';
import { FileInfo } from '@modules/file/domain/models/file-info.entity';

@Entity({ name: 'user_details' })
export class UserDetails implements IEditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'phone_number', nullable: true })
    phoneNumber?: string;

    @Column({ name: 'date_of_birth', nullable: true })
    dateOfBirth?: Date;

    @Column({ name: 'last_login', nullable: true })
    lastLogin?: Date;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender?: Gender;

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ name: 'avatar_id', nullable: true })
    avatarId?: string;

    @ManyToOne(() => FileInfo)
    @JoinColumn({ name: 'avatar_id' })
    avatar?: FileInfo;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToOne(() => User, (user) => user.details)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
