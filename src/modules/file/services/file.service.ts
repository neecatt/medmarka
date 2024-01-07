import { BadRequestException, Injectable } from '@nestjs/common';
import { encode } from 'blurhash';
import { ReadStream } from 'fs-capacitor';
import * as Minio from 'minio';
import sharp from 'sharp';
import streamToArray from 'stream-to-array';
import { v4 } from 'uuid';
import { FileUpload } from 'graphql-upload';
import { IMAGE_EXTENSIONS } from '../constants/extensions';
import { BlurhashMeta, FileInfoInput, FileInfoPayload } from '../domain/types/uploaded-file-info';
import { FileInfo } from '../domain/models/file-info.entity';
import { Logger } from '@modules/infrastructure/logging/logger';
import { getExtension, getObjectName } from '@modules/file/utils/file-helper';
import { S3_ACCESS_KEY, S3_BUCKET, S3_ENDPOINT, S3_SECRET_KEY } from '@config/environment';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { DbContext } from '@modules/db/db-context';

@Injectable()
export class FileService {
    constructor(private readonly logger: Logger, private readonly dbContext: DbContext) {}

    async uploadFileToS3(fileInfoInput: FileInfoInput): Promise<FileInfoPayload> {
        const { folder, filename, objectName, stream, mimetype, metaData, optimizeImages = true } = fileInfoInput;

        let extension = getExtension(filename);

        const defaultMetadata = {
            'Content-Type': mimetype,
        };

        let buffer: Buffer;
        let blurhash: BlurhashMeta;

        if (IMAGE_EXTENSIONS.includes(extension) && optimizeImages) {
            try {
                buffer = await this.optimizeImage(stream);
                defaultMetadata['Content-Type'] = 'image/jpeg';
                extension = 'jpg';
                blurhash = await this.encodeImageToBlurhash(buffer);
            } catch (error) {
                this.logger.error(error, FileService.name);
            }
        }

        const objectFullName = getObjectName(folder, objectName || v4(), extension);
        const minioClient = this.createClient();
        await minioClient.putObject(S3_BUCKET, objectFullName, buffer || stream, {
            ...defaultMetadata,
            ...metaData,
        });

        const { size } = await minioClient.statObject(S3_BUCKET, objectFullName);

        return {
            url: `https://${S3_ENDPOINT}/${S3_BUCKET}/${objectFullName}`,
            objectName: objectFullName,
            name: filename,
            extension,
            size,
            blurhash,
        };
    }

    async deleteFileFromS3(objectName: string): Promise<void> {
        const minioClient = this.createClient();
        await minioClient.removeObject(S3_BUCKET, objectName);
    }

    async deleteFilesFromS3(objectNames: string[]): Promise<void> {
        const minioClient = this.createClient();
        await minioClient.removeObjects(S3_BUCKET, objectNames);
    }

    async optimizeImage(stream: ReadStream): Promise<Buffer> {
        const bufferParts = await streamToArray(stream);
        const buffer = Buffer.concat(bufferParts);

        const image = sharp(buffer);
        const { width } = await image.metadata();

        const newWidth = Math.min(width, 1920);

        return await image.resize(newWidth).toFormat('jpeg').jpeg({ quality: 85 }).toBuffer();
    }

    async encodeImageToBlurhash(buffer: Buffer): Promise<BlurhashMeta> {
        const image = sharp(buffer);
        const initialMetadata = await image.metadata();

        const resizedBuffer = await image.resize(Math.min(initialMetadata.width, 160)).toBuffer();

        const resizedImage = sharp(resizedBuffer);
        const { width, height } = await resizedImage.metadata();

        const rawBuffer = await resizedImage.raw().ensureAlpha().toBuffer();
        const clamped = new Uint8ClampedArray(rawBuffer);
        const hash = encode(clamped, width, height, 4, 4);

        return { hash, width, height };
    }

    private createClient(): Minio.Client {
        return new Minio.Client({
            endPoint: S3_ENDPOINT,
            accessKey: S3_ACCESS_KEY,
            secretKey: S3_SECRET_KEY,
        });
    }

    async saveFile(filePromise: Promise<FileUpload>, folder: string, objectName?: string): Promise<FileInfo> {
        const { createReadStream, mimetype, filename } = await filePromise;
        const stream = createReadStream();
        const extension = getExtension(filename);

        if (!IMAGE_EXTENSIONS.includes(extension)) {
            throw new BadRequestException(ErrorCode.INVALID_FILE_EXTENSION);
        }

        const fileInfoPayload = await this.uploadFileToS3({
            folder,
            filename,
            objectName,
            stream,
            mimetype,
        });
        return await this.dbContext.fileInfos.saveFile(fileInfoPayload);
    }
}
