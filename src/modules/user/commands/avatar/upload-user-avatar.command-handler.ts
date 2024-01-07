import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { UploadUserAvatarCommand } from './upload-user-avatar.command';
import { FileService } from '@modules/file/services/file.service';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { UploadUserAvatarPayload } from '@modules/user/graphql/types/upload-user-avatar-mutation-types';
import { UserNode } from '@modules/user/graphql/types/connection-types/user-connection-types';

@CommandHandler(UploadUserAvatarCommand)
export class UploadUserAvatarCommandHandler
    extends BaseCommandHandler
    implements ICommandHandler<UploadUserAvatarCommand>
{
    constructor(private readonly fileservice: FileService) {
        super();
    }

    @Transactional()
    async execute({ userId, avatar }: UploadUserAvatarCommand): Promise<UploadUserAvatarPayload> {
        const userDetails = await this.dbContext.userDetails.findOne({
            where: { userId },
            relations: ['avatar'],
        });

        if (!userDetails) {
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        }

        const oldAvatar = userDetails?.avatar;

        const avatarFile = await this.fileservice.saveFile(avatar, 'avatar');

        userDetails.avatarId = avatarFile.id;
        userDetails.avatar = avatarFile;

        await this.dbContext.userDetails.save(userDetails);

        if (oldAvatar) {
            await this.dbContext.fileInfos.remove(oldAvatar);
        }

        const user = await this.dbContext.users.findOne({ where: { id: userDetails.userId } });

        return {
            user: plainToClass(UserNode, user),
        };
    }
}
