import { applyDecorators } from '@nestjs/common';
import { AuthorizeRoles } from './authorize-roles.decorator';
import { ResolverAuthOptions } from './authorize-user.decorator';
import { RoleName } from '@modules/user/domain/enums/role-name';

export const AuthorizeManager = (options: ResolverAuthOptions = {}): ReturnType<typeof applyDecorators> => {
    return applyDecorators(AuthorizeRoles([RoleName.Default], options));
};
