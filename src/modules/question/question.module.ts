import { Module } from '@nestjs/common';
import { TagService } from './services/tag.service';
import { UpdateQuestionCommandHandler } from './commands/question/update-question.command-handler';
import { DeleteQuestionsCommandHandler } from './commands/question/delete-questions.command-handler';
import { CreateQuestionCommandHandler } from './commands/question/create-question.command-handler';
import { CreateTagCommandHandler } from './commands/tag/create-tag.command-handler';
import { DeleteTagsCommandHandler } from './commands/tag/delete-tags.command-handler';
import { TagResolver } from './graphql/resolvers/tag.resolver';
import { QuestionResolver } from './graphql/resolvers/question.resolver';
import { GetTagQueryHandler } from './queries/tag/get-tag.query-handler';
import { GetAllTagsQueryHandler } from './queries/tag/get-all-tags.query-handler';
import { GetQuestionQueryHandler } from './queries/question/get-question.query-handler';
import { GetAllQuestionsQueryHandler } from './queries/question/get-all-questions.query-handler';
import { QuestionLoader } from './loaders/question.loader';
import { LikeQuestionCommandHandler } from './commands/question/like-question.command-handler';
import { BlockQuestionCommandHandler } from './commands/question/block-question.command-handler';
import { UnBlockQuestionCommandHandler } from './commands/question/unblock-question.command-handler';
import { GetQuestionsByTagIdQueryHandler } from './queries/question/get-questions-by-tag-id.query-handler';

import { GetPopularTagsQueryHandler } from './queries/tag/get-popular-tags.query-handler';
import { UserModule } from '@modules/user/user.module';
import { FileModule } from '@modules/file/file.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AnswerLoader } from '@modules/answer/loaders/answer.loader';
import { PatientLoader } from '@modules/patient/loaders/patient.loader';
import { TagLoader } from './loaders/tag.loader';
import { QuestionImageLoader } from './loaders/question-image.loader';
import { QuestionImageResolver } from './graphql/resolvers/question-image.resolver';
import { DeleteQuestionLikeCommandHandler } from './commands/question/delete-question-like.command-handler';
import { DislikeQuestionCommandHandler } from './commands/question/dislike-question.command-handler';
import { DeleteQuestionDislikeCommandHandler } from './commands/question/delete-question-dislike.command-handler';

const loaders = [QuestionLoader, AnswerLoader, PatientLoader, TagLoader, QuestionImageLoader];

const resolvers = [TagResolver, QuestionResolver, QuestionImageResolver];

const services = [TagService];

const commandHandlers = [
    UpdateQuestionCommandHandler,
    DeleteQuestionsCommandHandler,
    CreateQuestionCommandHandler,
    CreateTagCommandHandler,
    DeleteTagsCommandHandler,
    LikeQuestionCommandHandler,
    DeleteQuestionLikeCommandHandler,
    BlockQuestionCommandHandler,
    UnBlockQuestionCommandHandler,
    DislikeQuestionCommandHandler,
    DeleteQuestionDislikeCommandHandler,
];

const queryHandlers = [
    GetTagQueryHandler,
    GetAllTagsQueryHandler,
    GetQuestionQueryHandler,
    GetAllQuestionsQueryHandler,
    GetQuestionsByTagIdQueryHandler,
    GetPopularTagsQueryHandler,
];

@Module({
    imports: [FileModule, UserModule, AuthModule],
    providers: [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, ...services],
    exports: [...services, ...loaders],
})
export class QuestionModule { }
