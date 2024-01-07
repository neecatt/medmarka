import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { UserNode } from '@modules/user/graphql/types/connection-types/user-connection-types';

@InputType()
export class UploadUserAvatarInput {
    @IsNotEmpty()
    @Field(() => GraphQLUpload)
    avatar: Promise<FileUpload>;
}

@ObjectType()
export class UploadUserAvatarPayload {
    @Field(() => UserNode)
    user: UserNode;
}
