import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { ActivateAccountPayload } from '../graphql/types/activate-account-mutation-types';
import { AuthService } from '../services/auth.service';
import { ActivateAccountCommand } from './activate-account.command';
import { WEB_BASE_URL } from '@config/environment';
import { NotificationService } from '@modules/notification/services/notification.service';
import { ChannelType } from '@modules/notification/types/channel-type';
import { NotificationOptions } from '@modules/notification/types/notification-options';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { User } from '@modules/user/domain/models/user.entity';

@CommandHandler(ActivateAccountCommand)
export class ActivateAccountCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<ActivateAccountCommand, ActivateAccountPayload>
{
    constructor(private readonly authService: AuthService, private readonly notificationService: NotificationService) {
        super();
    }

    @Transactional()
    async execute({ token }: ActivateAccountCommand): Promise<ActivateAccountPayload> {
        const email = await this.authService.verifyEmailVerificationTokenAsync(token);

        const user = await this.dbContext.users.findOne({
            where: { email },
            relations: ['customer'],
        });

        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        if (user.emailVerified) {
            throw new BadRequestException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }
        user.verifyEmail();

        await this.dbContext.users.save(user);

        await this.sendMailToCustomer(user);

        return { success: true };
    }

    private async sendMailToCustomer({ firstName, lastName, email }: Partial<User>): Promise<void> {
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
