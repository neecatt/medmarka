import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { compare } from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';
import { AccessTokenPayload } from '../graphql/types/access-token-payload';
import { AuthService } from '../services/auth.service';
import { LoginCommand } from './login.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(LoginCommand)
export class LoginCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<LoginCommand, AccessTokenPayload>
{
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Transactional()
    async execute({ email, password }: LoginCommand): Promise<AccessTokenPayload> {
        email = email?.toLowerCase();

        const user = await this.dbContext.users.findOne({
            where: { email },
            relations: {
                patient: true,
                details: { avatar: true },
                userRoles: { role: true },
                userPermissions: { permission: true, parameter: true },
                doctor: true,
                manager: true,
            },
        });

        if (!user) {
            throw new ForbiddenException(ErrorCode.EMAIL_OR_PASSWORD_INVALID);
        }

        if (!user.emailVerified) {
            throw new BadRequestException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new ForbiddenException(ErrorCode.PASSWORD_INVALID);
        }

        if (!user.userRoles.length) {
            throw new NotFoundException(ErrorCode.ROLE_NOT_FOUND);
        }

        const accessToken = await this.authService.buildJwtPayload(user);

        user.details.lastLogin = new Date();

        await this.dbContext.userDetails.save(user.details);

        return { accessToken };
    }
}
