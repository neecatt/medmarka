import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionParameterType } from '../enums/permission-parameter-type';
import { PermissionParameterValue } from '../enums/permission-parameter-value';
import { Permission } from './permission.entity';
import { IAuditableEntity } from '@modules/shared/domain/interfaces/auditable-entity';

@Entity({ schema: 'permission', name: 'permission_parameters' })
export class PermissionParameter implements IAuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: PermissionParameterValue })
    value: PermissionParameterValue;

    @Column({ type: 'enum', enum: PermissionParameterType })
    type: PermissionParameterType;

    @Column()
    description: string;

    @Column({ name: 'permission_id' })
    permissionId: string;

    @ManyToOne(() => Permission)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
}
