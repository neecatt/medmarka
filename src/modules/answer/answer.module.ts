import { AuthModule } from '@modules/auth/auth.module';
import { FileModule } from '@modules/file/file.module';
import { QuestionLoader } from '@modules/question/loaders/question.loader';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { BlockAnswerCommandHandler } from './commands/block-answer.command-handler';
import { CreateAnswerCommandHandler } from './commands/create-answer.command-handler';
import { DeleteAnswersCommandHandler } from './commands/delete-answers.command-handler';
import { DislikeAnswerCommandHandler } from './commands/dislike-answer.command-handler';
import { UnBlockAnswerCommandHandler } from './commands/unblock-comment.command-handler';
import { UpdateAnswerCommandHandler } from './commands/update-answer.command-handler';
import { AnswerResolver } from './graphql/resolvers/answer.resolver';
import { AnswerLoader } from './loaders/answer.loader';
import { GetAllAnswersQueryHandler } from './queries/get-all-answers.query-handler';
import { GetAnswerQueryHandler } from './queries/get-answer.query-handler';
import { LikeAnswerCommandHandler } from './commands/like-answer.command-handler';
import { DeleteAnswerLikeCommandHandler } from './commands/delete-answer-like.command-handler';
import { DeleteAnswerDislikeCommandHandler } from './commands/delete-answer-dislike.command-handler';
import { CommmentLoader } from '@modules/comment/loaders/comment.loader';

const loaders = [AnswerLoader, QuestionLoader, CommmentLoader];

const resolvers = [AnswerResolver];

const services = [];

const commandHandlers = [
    DeleteAnswersCommandHandler,
    CreateAnswerCommandHandler,
    UpdateAnswerCommandHandler,
    LikeAnswerCommandHandler,
    DislikeAnswerCommandHandler,
    BlockAnswerCommandHandler,
    UnBlockAnswerCommandHandler,
    DeleteAnswerLikeCommandHandler,
    DeleteAnswerDislikeCommandHandler,
];

const queryHandlers = [GetAllAnswersQueryHandler, GetAnswerQueryHandler];

@Module({
    imports: [FileModule, UserModule, AuthModule],
    providers: [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, ...services],
    exports: [...services, ...loaders],
})
export class AnswerModule {}
