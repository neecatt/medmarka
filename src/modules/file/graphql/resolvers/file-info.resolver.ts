import { Injectable } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { FileInfoNode } from '../types/file-info-connection-types';
import { FileInfoLoader } from '@modules/file/loaders/file-info.loader';

@Injectable()
@Resolver(() => FileInfoNode)
export class FileInfoResolver {
    constructor(private readonly fileInfoLoader: FileInfoLoader) {}

    @Query(() => FileInfoNode)
    async fileInfo(@Args('id') id: string): Promise<FileInfoNode> {
        const fileInfo = await this.fileInfoLoader.byId.load(id);
        return plainToClass(FileInfoNode, fileInfo);
    }
}
