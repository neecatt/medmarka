import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { FileInfoLoader } from '@modules/file/loaders/file-info.loader';
import { FileInfoNode } from '@modules/file/graphql/types/file-info-connection-types';
import { QuestionImageNode } from '../types/question/question-image-connection-types';

@Resolver(() => QuestionImageNode)
export class QuestionImageResolver {
    constructor(private readonly fileInfoLoader: FileInfoLoader) { }

    @ResolveField(() => FileInfoNode)
    async file(@Parent() parent: QuestionImageNode): Promise<FileInfoNode> {
        const file = await this.fileInfoLoader.byId.load(parent.fileId);
        return plainToClass(FileInfoNode, file);
    }
}
