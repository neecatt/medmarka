import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserSettingConnection, UserSettingNode } from '../graphql/types/user-setting-connection-types';
import { GetAllSelectedSettingsQuery } from './get-all-selected-settings.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllSelectedSettingsQuery)
export class GetAllSelectedSettingsQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllSelectedSettingsQuery, UserSettingConnection>
{
    async execute({ userId }: GetAllSelectedSettingsQuery): Promise<UserSettingConnection> {
        const queryBuilder = this.dbContext.userSettings
            .createQueryBuilder('userSetting')
            .leftJoinAndSelect('userSetting.setting', 'setting');

        queryBuilder.where('userSetting.user_id = :userId', { userId });

        const connection = await this.dbContext.userSettings.getMany(queryBuilder, UserSettingNode);

        return connection;
    }
}
