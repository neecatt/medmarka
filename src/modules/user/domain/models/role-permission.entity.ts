import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionParameter } from './permission-parameter.entity';
import { Permission } from './permission.entity';
import { Role } from './role.entity';
import { IAuditableEntity } from '@modules/shared/domain/interfaces/auditable-entity';

@Entity({ schema: 'permission', name: 'role_permissions' })
@Index(['roleId', 'permissionId'], { unique: true })
export class RolePermission implements IAuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'role_id' })
    roleId: string;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ name: 'permission_id' })
    permissionId: string;

    @ManyToOne(() => Permission)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

    @Column({ name: 'parameter_id' })
    parameterId: string;

    @ManyToOne(() => PermissionParameter)
    @JoinColumn({ name: 'parameter_id' })
    parameter: PermissionParameter;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
}
