import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { compare, genSalt, hash } from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';
import { OtpResetPasswordPayload } from '../graphql/types/otp-reset-password-mutation-types';
import { AuthService } from '../services/auth.service';
import { OtpResetPasswordCommand } from './opt-reset-password.command';
import { User } from '@modules/user/domain/models/user.entity';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { NotificationOptions } from '@modules/notification/types/notification-options';
import { ChannelType } from '@modules/notification/types/channel-type';
import { NotificationService } from '@modules/notification/services/notification.service';

@CommandHandler(OtpResetPasswordCommand)
export class OtpResetPasswordCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<OtpResetPasswordCommand, OtpResetPasswordPayload>
{
    constructor(private readonly authService: AuthService, private readonly notificationService: NotificationService) {
        super();
    }

    @Transactional()
    async execute({ token, password, code }: OtpResetPasswordCommand): Promise<OtpResetPasswordPayload> {
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

        user.password = await hash(password, await genSalt(10));

        await this.dbContext.users.save(user);

        await this.sendMailToCustomer(user);

        return { success: true };
    }

    private async sendMailToCustomer({ firstName, lastName, email }: Partial<User>): Promise<void> {
        const context: any = {
            TITLE: 'Şifrə uğurla yeniləndi',
            SUBJECT: 'Şifrə uğurla yeniləndi',
            USER_FULL_NAME: `${firstName} ${lastName}`,
        };

        const options: NotificationOptions = {
            templateName: 'password-changed',
            channelConfigs: [
                {
                    channel: ChannelType.EMAIL,
                    to: { email },
                    context,
                },
            ],
        };

        await this.notificationService.send(options);
    }
}
