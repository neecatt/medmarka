import { Socket } from 'socket.io';
import { JwtPayload } from '../jwt/jwt-payload';

export interface AuthenticatedSocket extends Socket {
    user: JwtPayload;
}
