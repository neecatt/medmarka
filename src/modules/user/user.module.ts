import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UploadUserAvatarCommandHandler } from './commands/avatar/upload-user-avatar.command-handler';
import { CreateRoleCommandHandler } from './commands/role/create-role.command-handler';
import { DeleteRoleCommandHandler } from './commands/role/delete-role.command-handler';
import { UpdateRoleCommandHandler } from './commands/role/update-role.command-handler';
import { UpdateUserSettingCommandHandler } from './commands/update-user-setting.command-handler';
import { UpdateUserSettingsCommandHandler } from './commands/update-user-settings.command-handler';
import { PermissionResolver } from './graphql/resolvers/permission.resolver';
import { RolePermissionResolver } from './graphql/resolvers/role-permission.resolver';
import { RoleResolver } from './graphql/resolvers/role.resolver';
import { UserPermissionResolver } from './graphql/resolvers/user-permission.resolver';
import { UserSettingResolver } from './graphql/resolvers/user-setting.resolver';
import { UserResolver } from './graphql/resolvers/user.resolver';
import { PermissionParameterLoader } from './loaders/permission-parameter.loader';
import { PermissionLoader } from './loaders/permission.loader';
import { RoleLoader } from './loaders/role-loader';
import { RolePermissionloader } from './loaders/role-permission.loader';
import { UserDetailLoader } from './loaders/user-detail-loader';
import { UserLoader } from './loaders/user-loader';
import { GetAllSelectedSettingsQueryHandler } from './queries/get-all-selected-settings.query-handler';
import { GetAllPermisionsQueryHandler } from './queries/permission/get-all-permissions.query-handler';
import { GetAllUserPermisionsQueryHandler } from './queries/permission/get-all-user-permissions.query-handler';
import { GetAllRolesQueryHandler } from './queries/role/get-all-roles.query-handler';
import { GetRoleQueryHandler } from './queries/role/get-role.query-handler';
import { GetUserQueryHandler } from './queries/user/get-user.query-handler';
import { PermissionService } from './service/permission.service';
import { FileInfoLoader } from '@modules/user/loaders/file-info-loader';
import { FileModule } from '@modules/file/file.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JWT_SECRET } from '@config/environment';
import { DoctorLoader } from '@modules/doctor/loaders/doctor.loader';
import { PatientLoader } from '@modules/patient/loaders/patient.loader';

const resolvers = [
    UserResolver,
    RoleResolver,
    PermissionResolver,
    UserPermissionResolver,
    RolePermissionResolver,
    UserSettingResolver,
];

const services = [PermissionService];

const loaders = [
    UserLoader,
    RoleLoader,
    FileInfoLoader,
    UserDetailLoader,
    PermissionParameterLoader,
    PermissionLoader,
    RolePermissionloader,
    DoctorLoader,
    PatientLoader
];

const commandHandlers = [
    UploadUserAvatarCommandHandler,
    CreateRoleCommandHandler,
    UpdateUserSettingsCommandHandler,
    UpdateUserSettingCommandHandler,
    UpdateRoleCommandHandler,
    DeleteRoleCommandHandler,
];

const queryHandlers = [
    GetUserQueryHandler,
    GetRoleQueryHandler,
    GetUserQueryHandler,
    GetAllRolesQueryHandler,
    GetAllPermisionsQueryHandler,
    GetAllSelectedSettingsQueryHandler,
    GetAllUserPermisionsQueryHandler,
];

const providers = [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, ...services];

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {
                expiresIn: '365d',
            },
        }),
        FileModule,
        AuthModule,
    ],
    providers,
    exports: [UserLoader, FileInfoLoader, RoleLoader, ...services],
})
export class UserModule {}
