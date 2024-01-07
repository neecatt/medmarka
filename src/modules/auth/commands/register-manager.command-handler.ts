import { BadRequestException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { genSalt, hash } from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';
import { SendVerifyEmailCommand } from './send-verify-email.command';
import { RegisterManagerCommand } from './register-manager.command';
import { PermissionService } from '@modules/user/service/permission.service';
import { User } from '@modules/user/domain/models/user.entity';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(RegisterManagerCommand)
export class RegisterManagerCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<RegisterManagerCommand>
{
    constructor(private readonly commandBus: CommandBus, private readonly permissionService: PermissionService) {
        super();
    }

    @Transactional()
    async execute({ email, ...command }: RegisterManagerCommand): Promise<string> {
        email = email?.toLowerCase();

        const existingUser = await this.dbContext.users.findOneBy({ email });

        if (existingUser) {
            throw new BadRequestException(ErrorCode.USER_ALREADY_EXISTS);
        }

        const user = await this.registerUser(email, command);

        const manager = this.dbContext.managers.create({ user });

        await this.dbContext.managers.save(manager);

        await this.commandBus.execute(new SendVerifyEmailCommand(user.email));

        return manager.id;
    }

    private async registerUser(email: string, command: Partial<RegisterManagerCommand>): Promise<User> {
        const { password, firstName, lastName, roleIds, ...userDetailsInfo } = command;

        const roles = await this.permissionService.findRoles(roleIds);

        const passwordHash = await hash(password, await genSalt(10));

        const user = this.dbContext.users.create({
            firstName,
            lastName,
            email,
            password: passwordHash,
            userRoles: roles.map((role) => ({ role })),
            emailVerified: true,
        });

        await this.dbContext.users.save(user);

        await this.permissionService.assignRolePermissionsToUser(user, roles);

        const userDetails = this.dbContext.userDetails.create({ user, ...userDetailsInfo });

        await this.dbContext.userDetails.save(userDetails);

        return user;
    }
}
