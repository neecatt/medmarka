import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { ActivateAccountOtpPayload } from '../graphql/types/activate-account-otp-mutation-types';
import { AuthService } from '../services/auth.service';
import { ActivateAccountOtpCommand } from './activate-account-otp.command';
import { WEB_BASE_URL } from '@config/environment';
import { ChannelType } from '@modules/notification/types/channel-type';
import { NotificationOptions } from '@modules/notification/types/notification-options';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { NotificationService } from '@modules/notification/services/notification.service';
import { User } from '@modules/user/domain/models/user.entity';

@CommandHandler(ActivateAccountOtpCommand)
export class ActivateAccountOtpCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<ActivateAccountOtpCommand, ActivateAccountOtpPayload>
{
    constructor(private readonly authService: AuthService, private readonly notificationService: NotificationService) {
        super();
    }

    @Transactional()
    async execute(command: ActivateAccountOtpCommand): Promise<ActivateAccountOtpPayload> {
        const { otp, token } = command;

        const isValid = await this.authService.verifyOtpAsync(otp, token);

        if (!isValid) {
            throw new ForbiddenException(ErrorCode.VERIFICATION_CODE_IS_WRONG);
        }

        const email = await this.authService.verifyEmailVerificationTokenAsync(token);

        const user = await this.dbContext.users.findOneBy({ email });

        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        if (user.emailVerified) {
            throw new BadRequestException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }
        user.verifyEmail();

        await this.dbContext.users.save(user);

        await this.sendMailToUser(user);

        return { success: true };
    }

    private async sendMailToUser({ email, firstName, lastName }: Partial<User>): Promise<void> {
        const context: any = {
            TITLE: 'Hesabınız təsdiqləndi',
            SUBJECT: 'Hesabınız təsdiqləndi',
            USER_FULL_NAME: `${firstName} ${lastName}`,
            ORDERS_LINK: `${WEB_BASE_URL}/d/orders`,
            WAREHOUSES_LINK: `${WEB_BASE_URL}/d/warehouse`,
        };

        const options: NotificationOptions = {
            templateName: 'registration-complete',
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
