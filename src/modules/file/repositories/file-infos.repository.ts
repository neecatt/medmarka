import { Repository } from 'typeorm';
import { FileInfo } from '../domain/models/file-info.entity';
import { FileInfoPayload } from '../domain/types/uploaded-file-info';

type FileInfoRepository = Repository<FileInfo> & {
    saveFile(fileInfoPayload: FileInfoPayload): Promise<FileInfo>;
};

export const fileInfoRepository = (repository: Repository<FileInfo>): FileInfoRepository => {
    return repository.extend({
        async saveFile(fileInfoPayload: FileInfoPayload): Promise<FileInfo> {
            const fileInfo = this.create(fileInfoPayload);
            return await repository.save(fileInfo);
        },
    });
};
