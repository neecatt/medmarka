import { Module } from '@nestjs/common';
import { GenerateBlurhashesCommandHandler } from './commands/generate-blurhashes.command-handler';
import { FileController } from './controllers/file.controller';
import { FileInfoResolver } from './graphql/resolvers/file-info.resolver';
import { FileInfoLoader } from './loaders/file-info.loader';
import { FileService } from './services/file.service';

const loaders = [FileInfoLoader];

const resolvers = [FileInfoResolver];

const commandHandlers = [GenerateBlurhashesCommandHandler];

const queryHandlers = [];

@Module({
    imports: [],
    providers: [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, FileService],
    controllers: [FileController],
    exports: [FileInfoLoader, FileService],
})
export class FileModule {}
