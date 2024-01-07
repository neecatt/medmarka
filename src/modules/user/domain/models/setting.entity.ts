import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SettingDataType } from '../enums/setting-data-type';
import { SettingScope } from '../enums/setting-scope';
import { SettingType } from '../enums/setting-type';
import { AllowedSettingValue } from './allowed-setting-value';
import { SettingGroup } from './setting-group.entity';
import { IBaseEntity } from '@modules/shared/domain/interfaces/base-entity';

@Entity({ name: 'settings' })
export class Setting implements IBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ type: 'enum', enum: SettingType })
    type: SettingType;

    @Column({ type: 'jsonb' })
    scopes: SettingScope[];

    @Column()
    required: boolean;

    @Column({ name: 'data_type', type: 'enum', enum: SettingDataType })
    dataType: SettingDataType;

    @Column({ name: 'allowed_values', type: 'jsonb', nullable: true })
    allowedValues?: AllowedSettingValue[];

    @Column({ name: 'group_id', nullable: true })
    groupId: string;

    @ManyToOne(() => SettingGroup)
    @JoinColumn({ name: 'group_id' })
    group: SettingGroup;
}
