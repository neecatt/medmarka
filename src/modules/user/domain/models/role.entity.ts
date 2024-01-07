import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';
import { IBaseEntity } from '@modules/shared/domain/interfaces/base-entity';

@Entity({ name: 'roles' })
export class Role implements IBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column()
    name: string;

    @OneToMany(() => UserRole, (entity) => entity.role)
    userRoles: UserRole[];

    @OneToMany(() => RolePermission, (entity) => entity.role, { cascade: ['insert'] })
    rolePermissions: RolePermission[];
}
