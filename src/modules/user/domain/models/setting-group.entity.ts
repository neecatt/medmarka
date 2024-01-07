import { Entity, PrimaryGeneratedColumn, OneToMany, Column, Index } from 'typeorm';
import { Setting } from './setting.entity';
import { IBaseEntity } from '@modules/shared/domain/interfaces/base-entity';

@Entity({ name: 'setting_groups' })
export class SettingGroup implements IBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column()
    name: string;

    @OneToMany(() => Setting, (setting) => setting.group, { cascade: ['insert'] })
    settings: Setting[];
}
