import { registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
    PUBLISHED = 'PUBLISHED',
    REPORTED = 'REPORTED',
    REMOVED = 'REMOVED',
    BLOCKED = 'BLOCKED',
}

registerEnumType(CommentStatus, { name: 'CommentStatus' });
