import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { genSalt, hash } from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';
import { ResetPasswordPayload } from '../graphql/types/reset-password-mutation-types';
import { AuthService } from '../services/auth.service';
import { ResetPasswordCommand } from './reset-password.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { User } from '@modules/user/domain/models/user.entity';
import { ChannelType } from '@modules/notification/types/channel-type';
import { NotificationOptions } from '@modules/notification/types/notification-options';
import { NotificationService } from '@modules/notification/services/notification.service';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<ResetPasswordCommand, ResetPasswordPayload>
{
    constructor(private readonly authService: AuthService, private readonly notificationService: NotificationService) {
        super();
    }

    @Transactional()
    async execute({ token, password }: ResetPasswordCommand): Promise<ResetPasswordPayload> {
        const email = await this.authService.verifyPasswordResetTokenAsync(token);

        const user = await this.dbContext.users.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        user.password = await hash(password, await genSalt(10));

        await this.dbContext.users.save(user);

        // await this.sendMailToCustomer(user);

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
