import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetQuestionsByTagIdQuery } from '../question/get-questions-by-tag-id.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { QuestionConnection, QuestionNode } from '@modules/question/graphql/types/question/question-connection-types';

@QueryHandler(GetQuestionsByTagIdQuery)
export class GetQuestionsByTagIdQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetQuestionsByTagIdQuery, QuestionConnection>
{
    async execute(query: GetQuestionsByTagIdQuery): Promise<QuestionConnection> {
        const { tagId } = query;
        const queryBuilder = this.dbContext.questions
            .createQueryBuilder('q')
            .leftJoinAndSelect('q.tags', 't')
            .where('t.id = :tagId', { tagId });

        const connection = await this.dbContext.questions.getManyAndPaginate(queryBuilder, {}, QuestionNode);

        return connection;
    }
}
