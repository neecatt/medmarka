import { Module } from '@nestjs/common';
import { UpdateManagerCommandHandler } from './commands/update-manager.command-handler';
import { GetManagerQueryHandler } from './queries/get-manager.query-handler';
import { DeleteManagersCommandHandler } from './commands/delete-managers.command-handler';
import { UpdateManagerCommandByAdminHandler } from './commands/update-manager-by-admin.command-handler';
import { GetAllManagersQueryHandler } from './queries/get-all-managers.query-handler';
import { ManagerResolver } from './graphql/resolvers/manager.resolver';
import { FileModule } from '@modules/file/file.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';

const loaders = [];

const resolvers = [ManagerResolver];

const services = [];

const commandHandlers = [UpdateManagerCommandHandler, DeleteManagersCommandHandler, UpdateManagerCommandByAdminHandler];

const queryHandlers = [GetManagerQueryHandler, GetAllManagersQueryHandler];

@Module({
    imports: [FileModule, UserModule, AuthModule],
    providers: [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, ...services],
    exports: [...services],
})
export class ManagerModule {}
