import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { JwtPayload } from '../jwt/jwt-payload';
import { AuthService } from '../services/auth.service';
import { RoleName } from '@modules/user/domain/enums/role-name';

@Injectable()
export class EmptyIfUnauthorizedInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector, private authService: AuthService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = GqlExecutionContext.create(context);

        const { request } = ctx.getContext();

        const authorizationHeader: string = request.headers['authorization'];

        if (!authorizationHeader) return null;

        let user: JwtPayload;

        try {
            const token = authorizationHeader.split(' ')[1];
            user = await this.authService.verifyJwtTokenAsync(token);
        } catch (error) {
            return null;
        }

        const roles = this.reflector.get<RoleName[]>('roles', context.getHandler())?.map((r) => r.toString());

        if (roles && !roles.includes(user.roles[0])) return null;

        return next.handle();
    }
}
