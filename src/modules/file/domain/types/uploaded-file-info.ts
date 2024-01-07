import { Field, ObjectType } from '@nestjs/graphql';
import { ReadStream } from 'fs-capacitor';

@ObjectType()
export class BlurhashMeta {
    @Field()
    hash: string;

    @Field()
    width: number;

    @Field()
    height: number;
}

export type FileInfoPayload = {
    objectName: string;
    name: string;
    url: string;
    extension: string;
    size: number;
    blurhash?: BlurhashMeta;
};

export type FileInfoInput = {
    folder: string;
    filename: string;
    objectName?: string;
    stream: ReadStream;
    mimetype: string;
    metaData?: any;
    optimizeImages?: boolean;
};
