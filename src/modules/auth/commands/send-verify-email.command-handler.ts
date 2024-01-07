import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { SendVerifyEmailPayload } from '../graphql/types/send-verify-email-mutation-types';
import { AuthService } from '../services/auth.service';
import { SendVerifyEmailCommand } from './send-verify-email.command';
import { NotificationService } from '@modules/notification/services/notification.service';
import { WEB_BASE_URL } from '@config/environment';
import { ChannelType } from '@modules/notification/types/channel-type';
import { NotificationOptions } from '@modules/notification/types/notification-options';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(SendVerifyEmailCommand)
export class SendVerifyEmailCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<SendVerifyEmailCommand, SendVerifyEmailPayload>
{
    constructor(private readonly authService: AuthService, private readonly notificationService: NotificationService) {
        super();
    }

    @Transactional()
    async execute({ email }: SendVerifyEmailCommand): Promise<SendVerifyEmailPayload> {
        email = email?.toLowerCase();

        const user = await this.dbContext.users.findOne({ where: { email } });

        if (!user || user.emailVerified) return { sent: true };

        const { firstName, lastName } = user;

        const emailVerificationToken = await this.authService.generateEmailVerificationTokenAsync(user.email);

        const context: any = {
            TITLE: 'Hesabınızı təsdiqləyin',
            SUBJECT: 'Hesabınızı təsdiqləyin',
            USER_FULL_NAME: `${firstName} ${lastName}`,
            VERIFY_LINK: `${WEB_BASE_URL}/sign-in?token=${encodeURIComponent(emailVerificationToken)}`,
        };

        const options: NotificationOptions = {
            templateName: 'verify-email',
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
