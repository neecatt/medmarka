import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetQuestionQuery } from './get-question.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';
import { QuestionNode } from '@modules/question/graphql/types/question/question-connection-types';

@QueryHandler(GetQuestionQuery)
export class GetQuestionQueryHandler extends BaseQueryHandler implements IQueryHandler<GetQuestionQuery, QuestionNode> {
    async execute({ id }: GetQuestionQuery): Promise<QuestionNode> {
        const question = await this.dbContext.questions.findOneBy({ id });

        if (!question) {
            throw new NotFoundException(ErrorCode.QUESTION_NOT_FOUND);
        }

        return plainToClass(QuestionNode, question);
    }
}
