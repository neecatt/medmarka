import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { CreateFeedbackInput, CreateFeedbackPayload } from '../types/create-feedback-mutation-types';
import { FeedbackConnectionArgs } from '../types/feedback-connection-args';
import { FeedbackConnection, FeedbackNode } from '../types/feedback-connection-types';
import { MarkAsReadInput, MarkAsReadPayload } from '../types/mark-as-read-mutation-types';
import { MakeDecisionInput, MakeDecisionPayload } from '../types/make-decision-mutation-types';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { JwtPayload } from '@modules/auth/jwt/jwt-payload';
import { CreateFeedbackCommand } from '@modules/feedback/commands/create-feedback.command';
import { MarkAsReadCommand } from '@modules/feedback/commands/mark-as-read.command';
import { GetAllFeedbacksQuery } from '@modules/feedback/queries/get-all-feedbacks.query';
import { GetFeedbackQuery } from '@modules/feedback/queries/get-feedback.query';
import { MakeDecisionCommand } from '@modules/feedback/commands/make-decision.command';
import { QuestionNode } from '@modules/question/graphql/types/question/question-connection-types';
import { QuestionLoader } from '@modules/question/loaders/question.loader';
import { AnswerNode } from '@modules/answer/graphql/types/answer-connection-types';
import { AnswerLoader } from '@modules/answer/loaders/answer.loader';
import { CommentNode } from '@modules/comment/graphql/types/comment-connection-types';
import { CommmentLoader } from '@modules/comment/loaders/comment.loader';

@Resolver(() => FeedbackNode)
export default class FeedbackResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly questionLoader: QuestionLoader,
        private readonly answerLoader: AnswerLoader,
        private readonly commentLoader: CommmentLoader,
    ) {}

    @Mutation(() => CreateFeedbackPayload)
    async createFeedback(
        @Args('feedback') input: CreateFeedbackInput,
        @CurrentUser() user: JwtPayload,
    ): Promise<CreateFeedbackPayload> {
        const command = plainToClass(CreateFeedbackCommand, input, { excludeExtraneousValues: true });
        command.currentUser = user;
        return await this.commandBus.execute(command);
    }

    @Mutation(() => MarkAsReadPayload)
    async markAsRead(@Args('input') input: MarkAsReadInput): Promise<MarkAsReadPayload> {
        const command = plainToClass(MarkAsReadCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => MakeDecisionPayload)
    async makeFeedbackDecision(@Args('input') input: MakeDecisionInput): Promise<MakeDecisionPayload> {
        const command = plainToClass(MakeDecisionCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Query(() => FeedbackNode)
    async feedback(@Args('id') id: string): Promise<FeedbackNode> {
        return await this.queryBus.execute(new GetFeedbackQuery(id));
    }

    @Query(() => FeedbackConnection)
    async feedbacks(@Args() connectionArgs: FeedbackConnectionArgs): Promise<FeedbackConnection> {
        return await this.queryBus.execute(new GetAllFeedbacksQuery(connectionArgs));
    }

    @ResolveField(() => QuestionNode, { nullable: true })
    async question(@Parent() parent: FeedbackNode): Promise<QuestionNode> {
        const question = await this.questionLoader.byId.load(parent.sourceId);
        return plainToClass(QuestionNode, question);
    }

    @ResolveField(() => AnswerNode, { nullable: true })
    async answer(@Parent() parent: FeedbackNode): Promise<AnswerNode> {
        const answer = await this.answerLoader.byId.load(parent.sourceId);
        return plainToClass(AnswerNode, answer);
    }

    @ResolveField(() => CommentNode, { nullable: true })
    async comment(@Parent() parent: FeedbackNode): Promise<CommentNode> {
        const comment = await this.commentLoader.byId.load(parent.sourceId);
        return plainToClass(CommentNode, comment);
    }
}
