import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '@modules/auth/jwt/jwt-payload';
import { JWT_SECRET } from '@config/environment';

export const extractUserFromRequest = (request: Request): JwtPayload => {
    const authorizationHeader: string = request.headers['authorization'];

    if (!authorizationHeader) {
        return null;
    }

    try {
        const token = authorizationHeader.split(' ')[1];

        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
};

const factory = (field: keyof JwtPayload, context: ExecutionContext): JwtPayload | JwtPayload[typeof field] => {
    if (context.getType<GqlContextType>() === 'graphql') {
        const ctx = GqlExecutionContext.create(context);
        const { request } = ctx.getContext();

        const user = extractUserFromRequest(request);
        return field ? user && user[field] : user;
    }

    return null;
};

export const CurrentUser = createParamDecorator(factory);
