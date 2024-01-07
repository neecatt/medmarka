import { NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { FeedbackDecision } from '../domain/enums/feedback-decision';
import { FeedbackNode } from '../graphql/types/feedback-connection-types';
import { MakeDecisionPayload } from '../graphql/types/make-decision-mutation-types';
import { FeedbackSource } from '../domain/enums/feedback-source-type';
import { MakeDecisionCommand } from './make-decision.command';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { BaseCommandHandler } from '@modules/shared/commands/base-command-handler';
import { BlockQuestionCommand } from '@modules/question/commands/question/block-question.command';
import { BlockAnswerCommand } from '@modules/answer/commands/block-answer.command';
import { BlockCommentCommand } from '@modules/comment/commands/block-comment.command';
import { UnBlockQuestionCommand } from '@modules/question/commands/question/unblock-question.command';
import { UnBlockAnswerCommand } from '@modules/answer/commands/unblock-comment.command';
import { UnBlockCommentCommand } from '@modules/comment/commands/unblock-comment.command';

@CommandHandler(MakeDecisionCommand)
export class MakeDecisionCommandHandler extends BaseCommandHandler implements ICommandHandler<MakeDecisionCommand> {
    constructor(private readonly commandBus: CommandBus) {
        super();
    }
    @Transactional()
    async execute(command: MakeDecisionCommand): Promise<MakeDecisionPayload> {
        const { id, decision } = command;

        const feedback = await this.dbContext.feedbacks.findOneBy({ id });

        if (!feedback) {
            throw new NotFoundException(ErrorCode.FEEDBACK_NOT_FOUND);
        }

        this.feedbackBlock(decision, feedback.source, feedback);

        feedback.isRead = true;

        await this.dbContext.feedbacks.save(feedback);

        return { feedBack: plainToClass(FeedbackNode, feedback) };
    }

    private async feedbackBlock(
        decision: FeedbackDecision,
        source: FeedbackSource,
        feedback: FeedbackNode,
    ): Promise<void> {
        if (decision === FeedbackDecision.BLOCKED) {
            feedback.decision = FeedbackDecision.BLOCKED;
            if (source === FeedbackSource.QUESTION) {
                const blockedQuestion = new BlockQuestionCommand();
                blockedQuestion.questionId = feedback.sourceId;
                await this.commandBus.execute(blockedQuestion);
            } else if (source === FeedbackSource.ANSWER) {
                const blockedAnswer = new BlockAnswerCommand();
                blockedAnswer.answerId = feedback.sourceId;
                await this.commandBus.execute(blockedAnswer);
            } else if (source === FeedbackSource.COMMENT) {
                const blockedComment = new BlockCommentCommand();
                blockedComment.commentId = feedback.sourceId;
                await this.commandBus.execute(blockedComment);
            }
        } else if (decision === FeedbackDecision.UNBLOCK) {
            feedback.decision = FeedbackDecision.UNBLOCK;
            if (source === FeedbackSource.QUESTION) {
                const unblockedQuestion = new UnBlockQuestionCommand();
                unblockedQuestion.questionId = feedback.sourceId;
                await this.commandBus.execute(unblockedQuestion);
            } else if (source === FeedbackSource.ANSWER) {
                const unblockedAnswer = new UnBlockAnswerCommand();
                unblockedAnswer.answerId = feedback.sourceId;
                await this.commandBus.execute(unblockedAnswer);
            } else if (source === FeedbackSource.COMMENT) {
                const unblockedComment = new UnBlockCommentCommand();
                unblockedComment.commentId = feedback.sourceId;
                await this.commandBus.execute(unblockedComment);
            }
        }
    }
}
