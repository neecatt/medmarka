import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { FeedbackNode } from '../graphql/types/feedback-connection-types';
import { GetFeedbackQuery } from './get-feedback.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@QueryHandler(GetFeedbackQuery)
export class GetFeedbackQueryHandler extends BaseQueryHandler implements IQueryHandler<GetFeedbackQuery, FeedbackNode> {
    async execute({ id }: GetFeedbackQuery): Promise<FeedbackNode> {
        const feedback = this.dbContext.feedbacks.findOne({ where: { id } });

        if (!feedback) {
            throw new NotFoundException(ErrorCode.FEEDBACK_NOT_FOUND);
        }

        return plainToClass(FeedbackNode, feedback);
    }
}
