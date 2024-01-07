import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import otpGenerator from 'otp-generator';
import { Transactional } from 'typeorm-transactional';
import { SendVerifyOtpPayload } from '../graphql/types/send-verify-otp-mutation-types';
import { AuthService } from '../services/auth.service';
import { SendVerifyOtpCommand } from './send-verify-otp.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { NotificationOptions } from '@modules/notification/types/notification-options';
import { ChannelType } from '@modules/notification/types/channel-type';
import { NotificationService } from '@modules/notification/services/notification.service';

@CommandHandler(SendVerifyOtpCommand)
export class SendVerifyOtpCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<SendVerifyOtpCommand, SendVerifyOtpPayload>
{
    constructor(private readonly authService: AuthService, private readonly notificationService: NotificationService) {
        super();
    }

    @Transactional()
    async execute({ email }: SendVerifyOtpCommand): Promise<SendVerifyOtpPayload> {
        email = email?.toLowerCase();

        const user = await this.dbContext.users.findOne({ where: { email } });

        if (!user) {
            throw new BadRequestException(ErrorCode.USER_NOT_FOUND);
        }

        const { firstName, lastName } = user;

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const verifyToken = await this.authService.generateOtpVerifyTokenAsync(user.email, otp);
        console.log({ otp });
        const context: any = {
            TITLE: 'Your OTP code',
            SUBJECT: 'Your OTP code',
            USER_FULL_NAME: `${firstName} ${lastName}`,
            CODE: otp,
        };

        const options: NotificationOptions = {
            templateName: 'send-verify-otp',
            channelConfigs: [
                {
                    channel: ChannelType.EMAIL,
                    to: { email },
                    context,
                },
            ],
        };

        await this.notificationService.send(options);

        return { token: verifyToken };
    }
}
