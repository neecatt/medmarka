import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from '../types/authenticated-socket';
import { AuthService } from './auth.service';

@Injectable()
export class WsAuthService extends AuthService {
    async authenticateSocket(client: AuthenticatedSocket): Promise<AuthenticatedSocket> {
        const token = client.handshake.query.token.toString();
        const payload = await this.verifyJwtTokenAsync(token);
        client.user = await this.validateJwtPayloadAsync(payload);
        return client;
    }
}
