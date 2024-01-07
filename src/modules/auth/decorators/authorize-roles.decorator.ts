import { applyDecorators, SetMetadata } from '@nestjs/common';
import { AuthorizeUser, ResolverAuthOptions } from './authorize-user.decorator';
import { RoleName } from '@modules/user/domain/enums/role-name';

export const AuthorizeRoles = (
    roles: RoleName[],
    options: ResolverAuthOptions = {},
): ReturnType<typeof applyDecorators> => {
    return applyDecorators(SetMetadata('roles', roles), AuthorizeUser(options));
};
