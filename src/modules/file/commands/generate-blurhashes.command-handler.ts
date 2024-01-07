import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import axios from 'axios';
import { In } from 'typeorm';
import { FileService } from '../services/file.service';
import { GenerateBlurhashesCommand } from './generate-blurhashes.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';

@CommandHandler(GenerateBlurhashesCommand)
export class GenerateBlurhashesCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<GenerateBlurhashesCommand>
{
    constructor(private readonly fileService: FileService) {
        super();
    }

    async execute(): Promise<any> {
        const extentions = ['jpg', 'jpeg', 'png'];

        const files = await this.dbContext.fileInfos.find({
            where: { blurhash: null, extension: In(extentions) },
        });

        let succeededCount = 0;
        let failedCount = 0;
        let processedCount = 0;

        for (let i = 0; i < files.length; i++) {
            try {
                const file = files[i];

                const buffer = (await axios({ url: file.url, responseType: 'arraybuffer' })).data;

                const blurhash = await this.fileService.encodeImageToBlurhash(buffer);

                file.blurhash = blurhash;

                await this.dbContext.fileInfos.save(file);

                succeededCount++;
            } catch (error) {
                failedCount++;
                this.logger.error(error, GenerateBlurhashesCommandHandler.name);
            } finally {
                processedCount++;
            }
        }

        return {
            processed: processedCount,
            succeeded: succeededCount,
            failed: failedCount,
        };
    }
}
