import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FeedbackType } from '../domain/enums/feedback-type';
import { CreateFeedbackPayload } from '../graphql/types/create-feedback-mutation-types';
import { FeedbackSource } from '../domain/enums/feedback-source-type';
import { FeedbackDecision } from '../domain/enums/feedback-decision';
import { CreateFeedbackCommand } from './create-feedback.command';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { JwtPayload } from '@modules/auth/jwt/jwt-payload';

@CommandHandler(CreateFeedbackCommand)
export class CreateFeedbackCommandHandler extends BaseCommandHandler implements ICommandHandler<CreateFeedbackCommand> {
    async execute({
        reason,
        customReason,
        sourceId,
        currentUser,
    }: CreateFeedbackCommand): Promise<CreateFeedbackPayload> {
        let source: FeedbackSource;
        const question = await this.dbContext.questions.findOneBy({ id: sourceId });
        const answer = await this.dbContext.answers.findOneBy({ id: sourceId });
        if (question) {
            source = FeedbackSource.QUESTION;
        } else if (answer) {
            source = FeedbackSource.ANSWER;
        }

        await this.feedbackValidator(source, sourceId, currentUser, reason, customReason);

        const entity = this.dbContext.feedbacks.create({
            reason,
            customReason,
            source,
            sourceId,
            userId: currentUser.id,
        });

        const feedback = await this.dbContext.feedbacks.save(entity);

        return { feedback };
    }

    private async feedbackValidator(
        source: FeedbackSource,
        sourceId: string,
        currentUser: JwtPayload,
        reason: FeedbackType,
        customReason: string,
    ): Promise<void> {
        if (source === FeedbackSource.QUESTION) {
            await this.questionValidator(sourceId, reason, customReason, currentUser);
        } else if (source === FeedbackSource.ANSWER) {
            await this.answerValidator(sourceId, reason, customReason, currentUser);
        } else if (source === FeedbackSource.COMMENT) {
            await this.commentValidator(sourceId, reason, customReason, currentUser);
        } else {
            throw new BadRequestException(ErrorCode.INVALID_SOURCE);
        }
    }

    private async questionValidator(
        id: string,
        reason: FeedbackType,
        customReason: string,
        currentUser: JwtPayload,
    ): Promise<void> {
        const question = await this.dbContext.questions.findOneBy({
            id,
        });

        if (!question) {
            throw new BadRequestException(ErrorCode.INVALID_SOURCE);
        }

        const feedback = await this.dbContext.feedbacks.findOneBy({
            source: FeedbackSource.QUESTION,
            decision: FeedbackDecision.PENDING,
            userId: currentUser.id,
            sourceId: id,
        });

        if (feedback) {
            throw new BadRequestException(ErrorCode.FEEDBACK_ALREADY_EXIST);
        }

        if (reason !== FeedbackType.OTHER && customReason) {
            throw new ForbiddenException(ErrorCode.ACTION_NOT_ALLOWED);
        }
    }

    private async answerValidator(
        id: string,
        reason: FeedbackType,
        customReason: string,
        currentUser: JwtPayload,
    ): Promise<void> {
        const answer = await this.dbContext.answers.findOneBy({
            id,
        });

        if (!answer) {
            throw new BadRequestException(ErrorCode.INVALID_SOURCE);
        }

        if (currentUser.id === answer.userId) {
            throw new ForbiddenException(ErrorCode.ACTION_NOT_ALLOWED);
        }

        const feedback = await this.dbContext.feedbacks.findOneBy({
            source: FeedbackSource.ANSWER,
            decision: FeedbackDecision.PENDING,
            userId: currentUser.id,
            sourceId: id,
        });

        if (feedback) {
            throw new BadRequestException(ErrorCode.FEEDBACK_ALREADY_EXIST);
        }

        if (reason !== FeedbackType.OTHER && customReason) {
            throw new ForbiddenException(ErrorCode.ACTION_NOT_ALLOWED);
        }
    }

    private async commentValidator(
        id: string,
        reason: FeedbackType,
        customReason: string,
        currentUser: JwtPayload,
    ): Promise<void> {
        const comment = await this.dbContext.comments.findOneBy({
            id,
        });

        if (!comment) {
            throw new BadRequestException(ErrorCode.INVALID_SOURCE);
        }

        if (currentUser.id === comment.userId) {
            throw new ForbiddenException(ErrorCode.ACTION_NOT_ALLOWED);
        }

        const feedback = await this.dbContext.feedbacks.findOneBy({
            source: FeedbackSource.COMMENT,
            decision: FeedbackDecision.PENDING,
            userId: currentUser.id,
            sourceId: id,
        });

        if (feedback) {
            throw new ForbiddenException(ErrorCode.FEEDBACK_ALREADY_EXIST);
        }

        if (reason !== FeedbackType.OTHER && customReason) {
            throw new ForbiddenException(ErrorCode.ACTION_NOT_ALLOWED);
        }
    }
}
