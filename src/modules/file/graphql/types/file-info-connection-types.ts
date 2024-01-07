import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ConnectionType, EdgeType, RelayNode } from '@modules/shared/graphql/relay';
import { BlurhashMeta } from '@modules/file/domain/types/uploaded-file-info';

@ObjectType('FileInfo', { implements: RelayNode })
export class FileInfoNode implements RelayNode {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    objectName?: string;

    @Field()
    name: string;

    @Field()
    url: string;

    @Field()
    size: number;

    @Field()
    extension: string;

    @Field(() => BlurhashMeta, { nullable: true })
    blurhash?: BlurhashMeta;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field()
    version: number;
}

@ObjectType()
export class FileInfoEdge extends EdgeType(FileInfoNode) {}

@ObjectType()
export class FileInfoConnection extends ConnectionType(FileInfoNode, FileInfoEdge) {}
