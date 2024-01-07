import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { TagConnection, TagNode } from '../types/tag/tag-connection-types';
import { CreateTagInput, CreateTagPayload } from '../types/tag/create-tag-mutation-types';
import { DeleteTagsInput } from '../types/tag/delete-tags-mutation-types';
import { UserLoader } from '@modules/user/loaders/user-loader';
import { CreateTagCommand } from '@modules/question/commands/tag/create-tag.command';
import { DeleteTagsCommand } from '@modules/question/commands/tag/delete-tags.command';
import { GetPopularTagsQuery } from '@modules/question/queries/tag/get-popular-tags.query';

@Resolver(() => TagNode)
export class TagResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly userLoader: UserLoader,
    ) {}

    @Mutation(() => CreateTagPayload)
    async createTag(@Args('input') input: CreateTagInput): Promise<CreateTagPayload> {
        const command = plainToClass(CreateTagCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    // @AuthorizePermissions(PermissionName.DOCTORS_WIEW)
    @Mutation(() => Boolean)
    async deleteTags(@Args('input') input: DeleteTagsInput): Promise<boolean> {
        return await this.commandBus.execute(new DeleteTagsCommand(input.ids));
    }

    @Query(() => TagConnection)
    async popularTags(@Args('limit') limit: number): Promise<TagConnection> {
        return await this.queryBus.execute(new GetPopularTagsQuery(limit));
    }

    // @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    // @Query(() => DoctorNode)
    // async doctor(@Args('id') id: string): Promise<DoctorNode> {
    //     return await this.queryBus.execute(new GetDoctorQuery(id));
    // }

    // @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    // @Query(() => DoctorConnection)
    // async doctors(@Args() args: DoctorConnectionArgs): Promise<DoctorConnection> {
    //     return await this.queryBus.execute(new GetAllDoctorsQuery(args));
    // }

    // @ResolveField(() => UserNode)
    // async user(@Parent() doctor: DoctorNode): Promise<UserNode> {
    //     const user = await this.userLoader.byId.load(doctor.userId);
    //     return plainToClass(UserNode, user);
    // }
}
