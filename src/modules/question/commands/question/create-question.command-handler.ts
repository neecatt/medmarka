import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { CreateQuestionPayload } from '../../graphql/types/question/create-question-mutation-types';
import { QuestionNode } from '../../graphql/types/question/question-connection-types';
import { TagService } from '../../services/tag.service';
import { CreateQuestionCommand } from './create-question.command';
// import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { TagNode } from '@modules/question/graphql/types/tag/tag-connection-types';
import { CreateTagPayload } from '@modules/question/graphql/types/tag/create-tag-mutation-types';
import { FileUpload } from 'graphql-upload';
import { FileService } from '@modules/file/services/file.service';
import { FileInfo } from '@modules/file/domain/models/file-info.entity';
import { getExtension } from '@modules/file/utils/file-helper';
import { IMAGE_EXTENSIONS } from '@modules/file/constants/extensions';
import { BadRequestException } from '@nestjs/common';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionCommandHandler extends BaseCommandHandler implements ICommandHandler<CreateQuestionCommand> {
    constructor(private readonly tagService: TagService, private readonly fileService: FileService,) {
        super();
    }
    @Transactional()
    async execute(command: CreateQuestionCommand): Promise<CreateQuestionPayload> {
        const { patientId, tagNames, images } = command;

        const tags: TagNode[] = [];

        for (const tagName of tagNames) {
            const { tag }: CreateTagPayload = await this.tagService.autoCreateTag(tagName);

            tags.push(tag);
        }

        const entity = this.dbContext.questions.create({ ...command, patientId, tags, images: [], });

        if (images) {
            for (const filePromise of images) {
                const image = await this.saveQuestionImage(filePromise);
                const questionImage = this.dbContext.questionImages.create({ file: image });
                entity.images.push(questionImage);
            }
        }

        const question = await this.dbContext.questions.save(entity);

        return { question: plainToClass(QuestionNode, question) };


    }

    private async saveQuestionImage(filePromise: Promise<FileUpload>): Promise<FileInfo> {
        const { createReadStream, mimetype, filename } = await filePromise;
        const stream = createReadStream();

        const extension = getExtension(filename);
        if (!IMAGE_EXTENSIONS.includes(extension)) {
            throw new BadRequestException(ErrorCode.INVALID_FILE_EXTENSION);
        }

        const fileInfoPayload = await this.fileService.uploadFileToS3({
            folder: 'question-media',
            filename,
            stream,
            mimetype,
        });

        return await this.dbContext.fileInfos.saveFile(fileInfoPayload);
    }
}
