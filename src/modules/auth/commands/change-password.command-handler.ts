import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { compare, genSalt, hash } from 'bcryptjs';
import { ChangePasswordPayload } from '../graphql/types/change-password-mutation-types';
import { ResetPasswordPayload } from '../graphql/types/reset-password-mutation-types';
import { ChangePasswordCommand } from './change-password.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<ChangePasswordCommand, ChangePasswordPayload>
{
    constructor() {
        super();
    }

    async execute({ userId, currentPassword, newPassword }: ChangePasswordCommand): Promise<ResetPasswordPayload> {
        const user = await this.dbContext.users.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const isPasswordValid = await compare(currentPassword, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException(ErrorCode.PASSWORD_INVALID);
        }

        user.password = await hash(newPassword, await genSalt(10));

        await this.dbContext.users.save(user);

        return { success: true };
    }
}
