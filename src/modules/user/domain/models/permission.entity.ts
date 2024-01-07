import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionName } from '../enums/permission-name';
import { PermissionParameter } from './permission-parameter.entity';
import { UserPermission } from './user-permission.entity';
import { IAuditableEntity } from '@modules/shared/domain/interfaces/auditable-entity';

@Entity({ schema: 'permission', name: 'permissions' })
export class Permission implements IAuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ type: 'enum', enum: PermissionName })
    name: PermissionName;

    @Column()
    description: string;

    @OneToMany(() => PermissionParameter, (entity) => entity.permission, {
        cascade: ['insert', 'update'],
    })
    parameters: PermissionParameter[];

    @OneToMany(() => UserPermission, (entity) => entity.permission)
    userPermissions: UserPermission[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;
}
