import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserSettingsCommand } from './update-user-settings.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { UpdateUserSettingsPayload } from '@modules/user/graphql/types/update-user-settings-mutation-types';

@CommandHandler(UpdateUserSettingsCommand)
export class UpdateUserSettingsCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<UpdateUserSettingsCommand>
{
    async execute({ settings, userId }: UpdateUserSettingsCommand): Promise<UpdateUserSettingsPayload> {
        const userSettings = await this.dbContext.userSettings.find({ where: { userId } });

        if (userSettings) {
            await this.dbContext.userSettings.remove(userSettings);
        }

        const newSettings = settings.map((setting) => this.dbContext.userSettings.create({ userId, ...setting }));

        await this.dbContext.userSettings.save(newSettings);

        return { result: true };
    }
}
