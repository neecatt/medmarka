import { applyDecorators, SetMetadata } from '@nestjs/common';
import { AuthorizeUser, ResolverAuthOptions } from './authorize-user.decorator';

export const AuthorizePermissions = (
    permissionName: string,
    options: ResolverAuthOptions = {},
): ReturnType<typeof applyDecorators> => {
    return applyDecorators(SetMetadata('permissionName', permissionName), AuthorizeUser(options));
};
