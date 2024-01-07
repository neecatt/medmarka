import { Module } from '@nestjs/common';
import { CommentResolver } from './graphql/resolvers/comment.resolver';
import { CreateCommandHandler } from './commands/create-comment.command-handler ';
import { DeleteCommentsCommandHandler } from './commands/delete-comments.command-handler';
import { UpdateCommentCommandHandler } from './commands/update-comment.command-handler';
import { GetCommentQueryHandler } from './queries/get-comment.query-handler';
import { GetAllCommentsQueryHandler } from './queries/get-all-comments.query-handler';
import { BlockCommentCommandHandler } from './commands/block-comment.command-handler';
import { UnBlockCommentCommandHandler } from './commands/unblock-comment.command-handler';
import { CommmentLoader } from './loaders/comment.loader';
import { UserModule } from '@modules/user/user.module';
import { FileModule } from '@modules/file/file.module';
import { AuthModule } from '@modules/auth/auth.module';
import { QuestionModule } from '@modules/question/question.module';
import { AnswerModule } from '@modules/answer/answer.module';
import { AnswerLoader } from '@modules/answer/loaders/answer.loader';

const loaders = [AnswerLoader, CommmentLoader];

const resolvers = [CommentResolver];

const services = [];

const commandHandlers = [
    CreateCommandHandler,
    DeleteCommentsCommandHandler,
    UpdateCommentCommandHandler,
    BlockCommentCommandHandler,
    UnBlockCommentCommandHandler,
];

const queryHandlers = [GetCommentQueryHandler, GetAllCommentsQueryHandler];

@Module({
    imports: [FileModule, UserModule, AuthModule, QuestionModule, AnswerModule],
    providers: [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, ...services],
    exports: [...services],
})
export class CommentModule {}
