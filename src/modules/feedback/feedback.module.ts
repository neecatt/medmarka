import { Module } from '@nestjs/common';
import FeedbackResolver from './graphql/resolvers/feedback.resolver';
import { CreateFeedbackCommandHandler } from './commands/create-feedback.command-handler';
import { GetAllFeedbacksQueryHandler } from './queries/get-all-feedbacks.query-handler';
import { GetFeedbackQueryHandler } from './queries/get-feedback.query-handler';
import { MarkAsReadCommandHandler } from './commands/mark-as-read.command-handler';
import { MakeDecisionCommandHandler } from './commands/make-decision.command-handler';
import { AuthModule } from '@modules/auth/auth.module';
import { FileModule } from '@modules/file/file.module';
import { UserModule } from '@modules/user/user.module';
import { QuestionLoader } from '@modules/question/loaders/question.loader';
import { AnswerLoader } from '@modules/answer/loaders/answer.loader';
import { CommmentLoader } from '@modules/comment/loaders/comment.loader';

const loaders = [QuestionLoader, AnswerLoader, CommmentLoader];

const resolvers = [FeedbackResolver];

const services = [];

const commandHandlers = [CreateFeedbackCommandHandler, MakeDecisionCommandHandler, MarkAsReadCommandHandler];

const queryHandlers = [GetAllFeedbacksQueryHandler, GetFeedbackQueryHandler];

@Module({
    imports: [FileModule, UserModule, AuthModule],
    providers: [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, ...services],
    exports: [...services],
})
export class FeedbackModule {}
