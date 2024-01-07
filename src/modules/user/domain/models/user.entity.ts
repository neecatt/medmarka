import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { Device } from './device.entity';
import { UserDetails } from './user-detail.entity';
import { UserPermission } from './user-permission.entity';
import { UserRole } from './user-role.entity';
import { UserSetting } from './user-setting.entity';
import { IEditableEntity, ISoftRemovableEntity } from '@modules/shared/domain/interfaces';
import { Doctor } from '@modules/doctor/domain/models/doctor.entity';
import { Patient } from '@modules/patient/domain/models/patient.entity';
import { Manager } from '@modules/manager/domain/models/manager.entity';

@Entity({ name: 'users' })
export class User implements IEditableEntity, ISoftRemovableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ name: 'email_verified', default: false })
    emailVerified: boolean;

    @Column({ name: 'is_registered', default: false })
    isRegistered: boolean;

    @Column({ name: 'is_blocked', default: false })
    isBlocked: boolean;

    @OneToMany(() => UserRole, (entity) => entity.user, { cascade: ['insert', 'update'] })
    userRoles: UserRole[];

    @OneToMany(() => UserPermission, (entity) => entity.user)
    userPermissions: UserPermission[];

    @OneToOne(() => UserDetails, (UserDetails) => UserDetails.user, { cascade: ['update'] })
    details: UserDetails;

    @OneToOne(() => Doctor, (doctor) => doctor.user)
    doctor: Doctor;

    @OneToOne(() => Patient, (patient) => patient.user)
    patient: Patient;

    @OneToOne(() => Manager, (manager) => manager.user)
    manager: Manager;

    @OneToMany(() => Device, (device) => device.user)
    devices: Device[];

    @OneToMany(() => UserSetting, (setting) => setting.user)
    settings: UserSetting[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
    deletedAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;

    verifyEmail(): void {
        this.emailVerified = true;
    }
}
