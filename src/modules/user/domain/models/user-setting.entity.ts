import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { Setting } from './setting.entity';
import { User } from './user.entity';
import { IEditableEntity } from '@modules/shared/domain/interfaces';

@Entity({ name: 'user_settings' })
export class UserSetting implements IEditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.settings)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'setting_id' })
    settingId: string;

    @ManyToOne(() => Setting)
    @JoinColumn({ name: 'setting_id' })
    setting: Setting;

    @Column({ type: 'jsonb', nullable: true })
    value?: any;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
