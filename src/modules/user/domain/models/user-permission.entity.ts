import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionParameter } from './permission-parameter.entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';
import { IAuditableEntity } from '@modules/shared/domain/interfaces/auditable-entity';

@Entity({ schema: 'permission', name: 'user_permissions' })
@Index(['userId', 'permissionId'], { unique: true })
export class UserPermission implements IAuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

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
