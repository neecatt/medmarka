import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { RoleConnection, RoleNode } from '../types/connection-types/role-connection-types';
import { UserNode } from '../types/connection-types/user-connection-types';
import { UploadUserAvatarInput, UploadUserAvatarPayload } from '../types/upload-user-avatar-mutation-types';
import { AuthorizeUser } from '@modules/auth/decorators/authorize-user.decorator';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { FileInfoNode } from '@modules/file/graphql/types/file-info-connection-types';

import { getConnectionFromArray } from '@modules/shared/graphql/relay';
import { UploadUserAvatarCommand } from '@modules/user/commands/avatar/upload-user-avatar.command';
import { Gender } from '@modules/user/domain/enums/gender';
import { FileInfoLoader } from '@modules/user/loaders/file-info-loader';
import { RoleLoader } from '@modules/user/loaders/role-loader';
import { UserDetailLoader } from '@modules/user/loaders/user-detail-loader';
import { DoctorNode } from '@modules/doctor/graphql/types/doctor-connection-types';
import { DoctorLoader } from '@modules/doctor/loaders/doctor.loader';
import { PatientNode } from '@modules/patient/graphql/types/patient-connection-types';
import { PatientLoader } from '@modules/patient/loaders/patient.loader';

@Resolver(() => UserNode)
export class UserResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly fileInfoLoader: FileInfoLoader,
        private readonly roleLoader: RoleLoader,
        private readonly userDetailLoader: UserDetailLoader,
        private readonly doctorLoader: DoctorLoader,
        private readonly patientLoader: PatientLoader,
    ) {}

    @ResolveField(() => DoctorNode, { nullable: true })
    async doctor(@Parent() user: UserNode): Promise<DoctorNode> {
        const doctor = await this.doctorLoader.byUserId.load(user.id);
        return plainToClass(DoctorNode, doctor);
    }

    @ResolveField(() => PatientNode, { nullable: true })
    async patient(@Parent() user: UserNode): Promise<PatientNode> {
        const patient = await this.patientLoader.byUserId.load(user.id);
        return plainToClass(PatientNode, patient);
    }

    @ResolveField(() => RoleConnection)
    async roles(@Parent() user: UserNode): Promise<RoleConnection> {
        const roles = await this.roleLoader.byUserId.load(user.id);

        return getConnectionFromArray(roles, RoleNode);
    }

    //  -----  USER DETAILS

    @ResolveField(() => String, { nullable: true })
    async bio(@Parent() user: UserNode): Promise<string> {
        return await this.userDetailLoader.bioByUserId.load(user.id);
    }

    @ResolveField(() => String)
    async fullName(@Parent() user: UserNode): Promise<string> {
        return await this.userDetailLoader.fullnameByUserId.load(user.id);
    }

    @ResolveField(() => String, { nullable: true })
    async phoneNumber(@Parent() user: UserNode): Promise<string> {
        return await this.userDetailLoader.phoneNumberByUserId.load(user.id);
    }

    @ResolveField(() => String, { nullable: true })
    async address(@Parent() user: UserNode): Promise<string> {
        return await this.userDetailLoader.addressByUserId.load(user.id);
    }

    @ResolveField(() => Date, { nullable: true })
    async dateOfBirth(@Parent() user: UserNode): Promise<Date> {
        return await this.userDetailLoader.dateOfBirthdayByUserId.load(user.id);
    }

    @ResolveField(() => Gender)
    async gender(@Parent() user: UserNode): Promise<Gender> {
        return await this.userDetailLoader.genderByUserId.load(user.id);
    }

    @ResolveField(() => Date, { nullable: true })
    async lastLogin(@Parent() user: UserNode): Promise<Date> {
        return await this.userDetailLoader.lastLoginByUserId.load(user.id);
    }

    // --------------------  IMAGE   -------------------

    @ResolveField(() => FileInfoNode, { nullable: true })
    async avatar(@Parent() user: UserNode): Promise<FileInfoNode> {
        const avatar = await this.fileInfoLoader.avatarByUserId.load(user.id);
        return plainToClass(FileInfoNode, avatar);
    }

    @AuthorizeUser()
    @Mutation(() => UploadUserAvatarPayload)
    async uploadUserAvatar(
        @Args('input') input: UploadUserAvatarInput,
        @CurrentUser('id') userId: string,
    ): Promise<UploadUserAvatarPayload> {
        const command = plainToClass(UploadUserAvatarCommand, input);
        command.userId = userId;
        return await this.commandBus.execute(command);
    }
}
