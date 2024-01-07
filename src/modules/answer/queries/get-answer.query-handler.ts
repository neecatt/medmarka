import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AnswerNode } from '../graphql/types/answer-connection-types';
import { GetAnswerQuery } from './get-answer.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@QueryHandler(GetAnswerQuery)
export class GetAnswerQueryHandler extends BaseQueryHandler implements IQueryHandler<GetAnswerQuery, AnswerNode> {
    async execute({ id }: GetAnswerQuery): Promise<AnswerNode> {
        const answer = await this.dbContext.answers.findOneBy({ id });

        if (!answer) {
            throw new NotFoundException(ErrorCode.ANSWER_NOT_FOUND);
        }

        return plainToClass(AnswerNode, answer);
    }
}
