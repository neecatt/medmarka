import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DevicePlatform } from '../enums/device-platform';
import { User } from './user.entity';
import { IAuditableEntity } from '@modules/shared/domain/interfaces/auditable-entity';

@Entity({ name: 'devices' })
export class Device implements IAuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ name: 'push_token', type: 'jsonb' })
    pushToken: any;

    @Column({ type: 'enum', nullable: true, enum: DevicePlatform })
    platform?: DevicePlatform;

    @Column({ name: 'user_id', nullable: true })
    userId?: string;

    @ManyToOne(() => User, (user) => user.devices)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
}
