import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { OtpForgotPasswordPayload } from '../graphql/types/otp-forgot-password-mutation-types';
import { AuthService } from '../services/auth.service';
import { OtpForgotPasswordCommand } from './otp-forgot-password.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { NotificationOptions } from '@modules/notification/types/notification-options';
import { ChannelType } from '@modules/notification/types/channel-type';
import { NotificationService } from '@modules/notification/services/notification.service';

@CommandHandler(OtpForgotPasswordCommand)
export class OtpForgotPasswordCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<OtpForgotPasswordCommand, OtpForgotPasswordPayload>
{
    constructor(private readonly authService: AuthService, private readonly notificationService: NotificationService) {
        super();
    }

    @Transactional()
    async execute({ email }: OtpForgotPasswordCommand): Promise<OtpForgotPasswordPayload> {
        email = email?.toLowerCase();

        const user = await this.dbContext.users.findOne({ where: { email } });

        const { firstName, lastName } = user;

        const code = this.generate6DigitCode();

        const resetPasswordToken = await this.authService.generateOtpResetTokenAsync(user.email, code);

        const context: any = {
            TITLE: 'Həkimbaba hesab şifrəsinin bərpası',
            SUBJECT: 'Həkimbaba hesab şifrəsinin bərpası',
            USER_FULL_NAME: `${firstName} ${lastName}`,
            CODE: code,
            // PHONE_NUMBER: '994708204141',
        };

        const options: NotificationOptions = {
            templateName: 'otp-password-reset',
            channelConfigs: [
                {
                    channel: ChannelType.EMAIL,
                    to: { email },
                    context,
                },
            ],
        };
        await this.notificationService.send(options);

        return { token: resetPasswordToken };
    }

    generate6DigitCode(): string {
        const min = Math.ceil(100000);
        const max = Math.floor(999999);
        const code = Math.floor(Math.random() * (max - min + 1)) + min;
        return code.toString();
    }
}
