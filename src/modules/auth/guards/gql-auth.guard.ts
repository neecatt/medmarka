import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload, JwtPermission } from '../jwt/jwt-payload';
import { AuthService } from '../services/auth.service';
import { RoleName } from '@modules/user/domain/enums/role-name';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private authService: AuthService) {
        super();
    }

    getRequest(context: ExecutionContext): Request {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().request;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const request = this.getRequest(context);

        const user = request.user as JwtPayload;

        if (!user) return false;

        const roles = this.reflector.get<RoleName[]>('roles', context.getHandler());

        const permissionName = this.reflector.get<string>('permissionName', context.getHandler());

        if (roles) {
            return !!user.roles.find((r) => r === roles[0]);
        } else if (permissionName) {
            const userPermissions: JwtPermission[] = await this.authService.getPermissionsByUserId(user.id);
            return !!userPermissions.find((p) => p.name === permissionName);
        }

        if (!roles) return true;

        return false;
    }
}
