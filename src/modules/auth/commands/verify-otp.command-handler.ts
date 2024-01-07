import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { compare } from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';
import { AuthService } from '../services/auth.service';
import { VerifyOtpPayload } from '../graphql/types/verify-otp-mutation-types';
import { VerifyOtpCommand } from './verify-otp.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<VerifyOtpCommand, VerifyOtpPayload>
{
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Transactional()
    async execute({ code, token }: VerifyOtpCommand): Promise<VerifyOtpPayload> {
        const obj = await this.authService.verifyOtpResetTokenAsync(token);

        const { email, verificationCodeHash } = obj;

        const user = await this.dbContext.users.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const isCodeValid = await compare(code, verificationCodeHash);

        if (!isCodeValid) {
            throw new ForbiddenException(ErrorCode.VERIFICATION_CODE_IS_WRONG);
        }

        const resetPasswordToken = await this.authService.generatePasswordResetTokenAsync(user.email);

        return { token: resetPasswordToken };
    }
}
