import { Gender } from '@modules/user/domain/enums/gender';
import { PermissionName } from '@modules/user/domain/enums/permission-name';
import { PermissionParameterValue } from '@modules/user/domain/enums/permission-parameter-value';

export type JwtDoctor = {
    id: string;
};

export type JwtPatient = {
    id: string;
};

export type JwtManager = {
    id: string;
};

export type JwtAvatar = { url: string };

export type JwtPermission = { id: string; name: PermissionName; value: PermissionParameterValue };

export class JwtPayload {
    id: string;

    firstName: string;

    lastName: string;

    phoneNumber: string;

    email: string;

    roles: string[];

    // permissions: JwtPermission[];

    doctor?: JwtDoctor;

    manager?: JwtManager;

    patient?: JwtPatient;

    avatar?: JwtAvatar;

    gender?: Gender;
}
