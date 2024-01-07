import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import {
    DeleteQuestionDislikeInput,
    DeleteQuestionDislikePayload,
} from '../types/question-dislike/delete-question-dislike-mutation-types';
import {
    DislikeQuestionInput,
    DislikeQuestionPayload,
} from '../types/question-dislike/dislike-question-mutation-types';
import {
    DeleteQuestionLikeInput,
    DeleteQuestionLikePayload,
} from '../types/question-like/delete-question-like-mutation-types';
import { LikeQuestionInput, LikeQuestionPayload } from '../types/question-like/like-question-mutation-types';
import { BlockQuestionInput, BlockQuestionPayload } from '../types/question/block-question-mutation-types';
import { CreateQuestionInput, CreateQuestionPayload } from '../types/question/create-question-mutation-types';
import { DeleteQuestionsInput } from '../types/question/delete-questions-mutation-types';
import { QuestionConnectionArgs } from '../types/question/question-connection-args';
import { QuestionConnection, QuestionNode } from '../types/question/question-connection-types';
import { QuestionImageConnection, QuestionImageNode } from '../types/question/question-image-connection-types';
import { UnBlockQuestionInput, UnBlockQuestionPayload } from '../types/question/unblock-question-mutation-types';
import {
    UpdateQuestionByAdminInput,
    UpdateQuestionByAdminPayload,
} from '../types/question/update-question-by-admin-mutation-types';
import { UpdateQuestionInput, UpdateQuestionPayload } from '../types/question/update-question-mutation-types';
import { TagConnection, TagNode } from '../types/tag/tag-connection-types';
import { PermissionName } from '@modules/user/domain/enums/permission-name';
import { GetAllQuestionsQuery } from '@modules/question/queries/question/get-all-questions.query';
import { UpdateQuestionCommand } from '@modules/question/commands/question/update-question.command';
import { DeleteQuestionsCommand } from '@modules/question/commands/question/delete-questions.command';
import { CreateQuestionCommand } from '@modules/question/commands/question/create-question.command';
import { JwtPatient } from '@modules/auth/jwt/jwt-payload';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { AuthorizePermissions } from '@modules/auth/decorators/authorize-permission.decorator';
import { AuthorizePatient } from '@modules/auth/decorators/authorize-patient.decorator';

import { AnswerConnection, AnswerNode } from '@modules/answer/graphql/types/answer-connection-types';
import { AnswerLoader } from '@modules/answer/loaders/answer.loader';
import { AuthorizeUser } from '@modules/auth/decorators/authorize-user.decorator';
import { PatientNode } from '@modules/patient/graphql/types/patient-connection-types';
import { PatientLoader } from '@modules/patient/loaders/patient.loader';
import { BlockQuestionCommand } from '@modules/question/commands/question/block-question.command';
import { DeleteQuestionDislikeCommand } from '@modules/question/commands/question/delete-question-dislike.command';
import { DeleteQuestionLikeCommand } from '@modules/question/commands/question/delete-question-like.command';
import { DislikeQuestionCommand } from '@modules/question/commands/question/dislike-question.command';
import { LikeQuestionCommand } from '@modules/question/commands/question/like-question.command';
import { UnBlockQuestionCommand } from '@modules/question/commands/question/unblock-question.command';
import { QuestionImageLoader } from '@modules/question/loaders/question-image.loader';
import { TagLoader } from '@modules/question/loaders/tag.loader';
import { GetQuestionQuery } from '@modules/question/queries/question/get-question.query';
import { GetQuestionsByTagIdQuery } from '@modules/question/queries/question/get-questions-by-tag-id.query';
import { getConnectionFromArray } from '@modules/shared/graphql/relay';

@Resolver(() => QuestionNode)
export class QuestionResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly answerLoader: AnswerLoader,
        private readonly patientLoader: PatientLoader,
        private readonly tagLoader: TagLoader,
        private readonly questionImageLoader: QuestionImageLoader,
    ) {}

    @Mutation(() => CreateQuestionPayload)
    async createQuestion(
        @Args('input') input: CreateQuestionInput,
        @CurrentUser('patient') patient: JwtPatient,
    ): Promise<CreateQuestionPayload> {
        const command = plainToClass(CreateQuestionCommand, input, { excludeExtraneousValues: true });
        command.patientId = patient.id;
        return await this.commandBus.execute(command);
    }

    @AuthorizePatient()
    @Mutation(() => UpdateQuestionPayload)
    async updateQuestion(
        @Args('question') input: UpdateQuestionInput,
        @CurrentUser('patient') patient: JwtPatient,
    ): Promise<UpdateQuestionPayload> {
        const command = plainToClass(UpdateQuestionCommand, input, { excludeExtraneousValues: true });
        command.patientId = patient.id;
        return await this.commandBus.execute(command);
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_UPDATE)
    @Mutation(() => UpdateQuestionByAdminPayload)
    async updateQuestionByAdmin(
        @Args('input') input: UpdateQuestionByAdminInput,
    ): Promise<UpdateQuestionByAdminPayload> {
        const command = plainToClass(UpdateQuestionCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    // @AuthorizePermissions(PermissionName.DOCTORS_WIEW)
    @Mutation(() => Boolean)
    async deleteQuestions(@Args('input') input: DeleteQuestionsInput): Promise<boolean> {
        return await this.commandBus.execute(new DeleteQuestionsCommand(input.ids));
    }

    @AuthorizeUser()
    @Mutation(() => LikeQuestionPayload)
    async likeQuestion(
        @Args('questionId') input: LikeQuestionInput,
        @CurrentUser('id') userId: string,
    ): Promise<LikeQuestionPayload> {
        const command = plainToClass(LikeQuestionCommand, input);
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @AuthorizeUser()
    @Mutation(() => DeleteQuestionLikePayload)
    async deleteQuestionLike(
        @Args('questionId') input: DeleteQuestionLikeInput,
        @CurrentUser('id') userId: string,
    ): Promise<DeleteQuestionLikePayload> {
        const command = plainToClass(DeleteQuestionLikeCommand, input);
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @AuthorizeUser()
    @Mutation(() => DislikeQuestionPayload)
    async DislikeQuestion(
        @Args('questionId') input: DislikeQuestionInput,
        @CurrentUser('id') userId: string,
    ): Promise<DislikeQuestionPayload> {
        const command = plainToClass(DislikeQuestionCommand, input);
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @AuthorizeUser()
    @Mutation(() => DeleteQuestionDislikePayload)
    async deleteQuestionDislike(
        @Args('questionId') input: DeleteQuestionDislikeInput,
        @CurrentUser('id') userId: string,
    ): Promise<DeleteQuestionDislikePayload> {
        const command = plainToClass(DeleteQuestionDislikeCommand, input);
        command.userId = userId;
        return await this.commandBus.execute(command);
    }

    @Mutation(() => BlockQuestionPayload)
    async blockQuestion(@Args('question') input: BlockQuestionInput): Promise<BlockQuestionPayload> {
        const command = plainToClass(BlockQuestionCommand, input);
        return await this.commandBus.execute(command);
    }

    @Mutation(() => UnBlockQuestionPayload)
    async unblockQuestion(@Args('question') input: UnBlockQuestionInput): Promise<UnBlockQuestionPayload> {
        const command = plainToClass(UnBlockQuestionCommand, input);
        return await this.commandBus.execute(command);
    }

    // @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => QuestionNode)
    async question(@Args('id') id: string): Promise<QuestionNode> {
        return await this.queryBus.execute(new GetQuestionQuery(id));
    }

    // @AuthorizePermissions(PermissionName.COMMON_SETTINGS_VIEW)
    @Query(() => QuestionConnection)
    async questions(@Args() args: QuestionConnectionArgs): Promise<QuestionConnection> {
        return await this.queryBus.execute(new GetAllQuestionsQuery(args));
    }

    @Query(() => QuestionConnection)
    async questionsByTagId(@Args('tagId') tagId: string): Promise<QuestionConnection> {
        const question = await this.queryBus.execute(new GetQuestionsByTagIdQuery(tagId));
        console.log(question);
        return question;
    }

    @ResolveField(() => AnswerConnection, { nullable: true })
    async answers(@Parent() question: QuestionNode): Promise<AnswerConnection> {
        const answers = await this.answerLoader.byQuestionId.load(question.id);
        return getConnectionFromArray(answers, AnswerNode);
    }

    @ResolveField(() => TagConnection, { nullable: true })
    async tags(@Parent() question: QuestionNode): Promise<TagConnection> {
        const tags = await this.tagLoader.byQuestionId.load(question.id);
        return getConnectionFromArray(tags, TagNode);
    }

    @ResolveField(() => PatientNode)
    async patient(@Parent() question: QuestionNode): Promise<PatientNode> {
        const patient = await this.patientLoader.byId.load(question.patientId);
        return plainToClass(PatientNode, patient);
    }

    @ResolveField(() => QuestionImageConnection)
    async images(@Parent() question: QuestionNode): Promise<QuestionImageConnection> {
        const images = await this.questionImageLoader.byQuestionId.load(question.id);
        return getConnectionFromArray(images, QuestionImageNode);
    }
}
