import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { ForgotPasswordPayload } from '../graphql/types/forgot-password-mutation-types';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordCommand } from './forgot-password.command';
import { WEB_BASE_URL } from '@config/environment';
import { ChannelType } from '@modules/notification/types/channel-type';
import { NotificationOptions } from '@modules/notification/types/notification-options';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { NotificationService } from '@modules/notification/services/notification.service';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<ForgotPasswordCommand, ForgotPasswordPayload>
{
    constructor(private readonly authService: AuthService, private readonly notificationService: NotificationService) {
        super();
    }

    @Transactional()
    async execute({ email }: ForgotPasswordCommand): Promise<ForgotPasswordPayload> {
        email = email?.toLowerCase();

        const user = await this.dbContext.users.findOne({ where: { email } });

        if (!user) return { sent: true };

        const { firstName, lastName } = user;

        const resetPasswordToken = await this.authService.generatePasswordResetTokenAsync(user.email);

        const context: any = {
            TITLE: 'Həkimbaba hesab şifrəsinin bərpası',
            SUBJECT: 'Həkimbaba hesab şifrəsinin bərpası',
            USER_FULL_NAME: `${firstName} ${lastName}`,
            PASSWORD_RESET_LINK: `${WEB_BASE_URL}/reset-password?code=${encodeURIComponent(resetPasswordToken)}`,
            // PHONE_NUMBER: '994708204141',
        };

        const options: NotificationOptions = {
            templateName: 'password-reset',
            channelConfigs: [
                {
                    channel: ChannelType.EMAIL,
                    to: { email },
                    context,
                },
            ],
        };
        await this.notificationService.send(options);

        return { sent: true };
    }
}
