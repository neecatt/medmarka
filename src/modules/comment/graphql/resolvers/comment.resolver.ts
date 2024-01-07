import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Resolver, Mutation, Query, Parent, ResolveField } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { CommentConnection, CommentNode } from '../types/comment-connection-types';
import { CreateCommentInput, CreateCommentPayload } from '../types/create-comment-mutation-types';
import { DeleteCommentsInput } from '../types/delete-comments-mutation-types';
import { UpdateCommentInput, UpdateCommentPayload } from '../types/update-comment-mutation-types';
import { CommentConnectionArgs } from '../types/comment-connection-args';
// import { AuthorizePermissions } from '@modules/auth/decorators/authorize-permission.decorator';
// import { PermissionName } from '@modules/user/domain/enums/permission-name';
import { BlockCommentInput, BlockCommentPayload } from '../types/block-comment-mutation-types';
import { UnBlockCommentInput, UnBlockCommentPayload } from '../types/unblock-comment-mutation-types';
import { CreateCommentCommand } from '@modules/comment/commands/create-comment.command';
import { DeleteCommentsCommand } from '@modules/comment/commands/delete-comments.command';
import { UpdateCommentCommand } from '@modules/comment/commands/update-comment.command';
import { GetCommentQuery } from '@modules/comment/queries/get-comment.query';
import { GetAllCommentsQuery } from '@modules/comment/queries/get-all-comments.query';
import { QuestionNode } from '@modules/question/graphql/types/question/question-connection-types';
import { AnswerLoader } from '@modules/answer/loaders/answer.loader';
import { AnswerNode } from '@modules/answer/graphql/types/answer-connection-types';
import { QuestionLoader } from '@modules/question/loaders/question.loader';
import { BlockCommentCommand } from '@modules/comment/commands/block-comment.command';
import { UnBlockCommentCommand } from '@modules/comment/commands/unblock-comment.command';

@Resolver(() => CommentNode)
export class CommentResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly questionLoader: QuestionLoader,
        private readonly answerLoader: AnswerLoader,
    ) {}

    @Mutation(() => CreateCommentPayload)
    async createComment(@Args('input') input: CreateCommentInput): Promise<CreateCommentPayload> {
        const command = plainToClass(CreateCommentCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => Boolean)
    async deleteComments(@Args('input') input: DeleteCommentsInput): Promise<boolean> {
        return await this.commandBus.execute(new DeleteCommentsCommand(input.ids));
    }

    @Mutation(() => UpdateCommentPayload)
    async updateComment(@Args('comment') input: UpdateCommentInput): Promise<UpdateCommentPayload> {
        const command = plainToClass(UpdateCommentCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => BlockCommentPayload)
    async blockComment(@Args('comment') input: BlockCommentInput): Promise<BlockCommentPayload> {
        const command = plainToClass(BlockCommentCommand, input);
        return await this.commandBus.execute(command);
    }

    @Mutation(() => UnBlockCommentPayload)
    async unblockComment(@Args('comment') input: UnBlockCommentInput): Promise<UnBlockCommentPayload> {
        const command = plainToClass(UnBlockCommentCommand, input);
        return await this.commandBus.execute(command);
    }

    // @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => CommentNode)
    async comment(@Args('id') id: string): Promise<CommentNode> {
        return await this.queryBus.execute(new GetCommentQuery(id));
    }

    // @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => CommentConnection)
    async comments(@Args() args: CommentConnectionArgs): Promise<CommentConnection> {
        return await this.queryBus.execute(new GetAllCommentsQuery(args));
    }

    @ResolveField(() => QuestionNode)
    async question(@Parent() comment: CommentNode): Promise<QuestionNode> {
        const question = await this.questionLoader.byId.load(comment.questionId);
        return plainToClass(QuestionNode, question);
    }

    @ResolveField(() => AnswerNode)
    async answer(@Parent() comment: CommentNode): Promise<AnswerNode> {
        const answer = await this.answerLoader.byId.load(comment.answerId);
        return plainToClass(AnswerNode, answer);
    }
}
