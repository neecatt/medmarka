import { NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { AnswerConnectionArgs } from '../types/answer-connection-args';
import { AnswerConnection, AnswerNode } from '../types/answer-connection-types';
import { CreateAnswerInput, CreateAnswerPayload } from '../types/create-answer-mutation-types';
import { DeleteAnswersInput } from '../types/delete-answers-mutation-types';
import { UpdateAnswerInput, UpdateAnswerPayload } from '../types/update-answer-mutation-types';
import { BlockAnswerInput, BlockAnswerPayload } from '../types/block-answer-mutation-types';
import { UnBlockAnswerInput, UnBlockAnswerPayload } from '../types/unblock-answer-mutation-types';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { JwtPayload } from '@modules/auth/jwt/jwt-payload';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { UpdateAnswerCommand } from '@modules/answer/commands/update-answer.command';
import { DeleteAnswersCommand } from '@modules/answer/commands/delete-answers.command';
import { CreateAnswerCommand } from '@modules/answer/commands/create-answer.command';
// import { AuthorizePermissions } from '@modules/auth/decorators/authorize-permission.decorator';
// import { PermissionName } from '@modules/user/domain/enums/permission-name';
import { LikeAnswerCommand } from '@modules/answer/commands/like-answer.command';
import { GetAllAnswersQuery } from '@modules/answer/queries/get-all-answers.query';
import { GetAnswerQuery } from '@modules/answer/queries/get-answer.query';
import { AuthorizeUser } from '@modules/auth/decorators/authorize-user.decorator';
import { DislikeAnswerCommand } from '@modules/answer/commands/dislike-answer.command';
import { QuestionNode } from '@modules/question/graphql/types/question/question-connection-types';
import { QuestionLoader } from '@modules/question/loaders/question.loader';
import { BlockAnswerCommand } from '@modules/answer/commands/block-answer.command';
import { UnBlockAnswerCommand } from '@modules/answer/commands/unblock-comment.command';
import { LikeAnswerInput, LikeAnswerPayload } from '../types/answer-like/like-answer-mutation-types';
import { DeleteAnswerLikeInput, DeleteAnswerLikePayload } from '../types/answer-like/delete-answer-like-mutation-types';
import { DeleteAnswerLikeCommand } from '@modules/answer/commands/delete-answer-like.command';
import { DislikeAnswerInput, DislikeAnswerPayload } from '../types/answer-dislike/dislike-answer-mutation-types';
import { DeleteAnswerDislikeInput, DeleteAnswerDislikePayload } from '../types/answer-dislike/delete-answer-dislike-mutation-types';
import { DeleteAnswerDislikeCommand } from '@modules/answer/commands/delete-answer-dislike.command';
import { CommentConnection, CommentNode } from '@modules/comment/graphql/types/comment-connection-types';
import { CommmentLoader } from '@modules/comment/loaders/comment.loader';
import { getConnectionFromArray } from '@modules/shared/graphql/relay';

@Resolver(() => AnswerNode)
export class AnswerResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly questionLoader: QuestionLoader,
        private readonly commentLoader: CommmentLoader,
    ) {}

    @Mutation(() => CreateAnswerPayload)
    async createAnswer(@Args('input') input: CreateAnswerInput): Promise<CreateAnswerPayload> {
        const command = plainToClass(CreateAnswerCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => Boolean)
    async deleteAnswers(@Args('input') input: DeleteAnswersInput): Promise<boolean> {
        return await this.commandBus.execute(new DeleteAnswersCommand(input.ids));
    }

    @Mutation(() => UpdateAnswerPayload)
    async updateAnswer(
        @Args('answer') input: UpdateAnswerInput,
        @CurrentUser() user: JwtPayload,
    ): Promise<UpdateAnswerPayload> {
        const command = plainToClass(UpdateAnswerCommand, input, { excludeExtraneousValues: true });
        if (!user) throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
        command.userId = user.id;
        return await this.commandBus.execute(command);
    }

    @Mutation(() => BlockAnswerPayload)
    async blockAnswer(@Args('answer') input: BlockAnswerInput): Promise<BlockAnswerPayload> {
        const command = plainToClass(BlockAnswerCommand, input);
        return await this.commandBus.execute(command);
    }

    @Mutation(() => UnBlockAnswerPayload)
    async unblockAnswer(@Args('answer') input: UnBlockAnswerInput): Promise<UnBlockAnswerPayload> {
        const command = plainToClass(UnBlockAnswerCommand, input);
        return await this.commandBus.execute(command);
    }

    @AuthorizeUser()
    @Mutation(() => LikeAnswerPayload)
    async likeAnswer(
        @Args('answerId') input: LikeAnswerInput,
        @CurrentUser('id') userId: string,
    ): Promise<LikeAnswerPayload> {
        const command = plainToClass(LikeAnswerCommand, input);
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @AuthorizeUser()
    @Mutation(() => DeleteAnswerLikePayload)
    async deleteAnswerLike(
        @Args('answerId') input: DeleteAnswerLikeInput,
        @CurrentUser('id') userId: string,
    ): Promise<DeleteAnswerLikePayload> {
        const command = plainToClass(DeleteAnswerLikeCommand, input);
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @AuthorizeUser()
    @Mutation(() => DislikeAnswerPayload)
    async DislikeAnswer(
        @Args('answerId') input: DislikeAnswerInput,
        @CurrentUser('id') userId: string,
    ): Promise<DislikeAnswerPayload> {
        const command = plainToClass(DislikeAnswerCommand, input);
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @AuthorizeUser()
    @Mutation(() => DeleteAnswerDislikePayload)
    async deleteAnswerDislike(
        @Args('answerId') input: DeleteAnswerDislikeInput,
        @CurrentUser('id') userId: string,
    ): Promise<DeleteAnswerDislikePayload> {
        const command = plainToClass(DeleteAnswerDislikeCommand, input);
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    // @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => AnswerNode)
    async answer(@Args('id') id: string): Promise<AnswerNode> {
        return await this.queryBus.execute(new GetAnswerQuery(id));
    }

    // @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => AnswerConnection)
    async answers(@Args() args: AnswerConnectionArgs): Promise<AnswerConnection> {
        return await this.queryBus.execute(new GetAllAnswersQuery(args));
    }

    @ResolveField(() => QuestionNode)
    async question(@Parent() answer: AnswerNode): Promise<QuestionNode> {
        const question = await this.questionLoader.byId.load(answer.questionId);
        return plainToClass(QuestionNode, question);
    }

    @ResolveField(() => CommentConnection)
    async comments(@Parent() answer: AnswerNode): Promise<CommentConnection> {
        const comments = await this.commentLoader.byAnswerId.load(answer.id);
        return getConnectionFromArray(comments, CommentNode);
    }
}
