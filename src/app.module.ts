import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { FileModule } from './modules/file/file.module';
import { APP_ENV } from '@config/environment';
import { AuthModule } from '@modules/auth/auth.module';
import { DatabaseModule } from '@modules/db/database.module';
import { DoctorModule } from '@modules/doctor/doctor.module';
import { InfrastructureModule } from '@modules/infrastructure/infrastructure.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { SharedModule } from '@modules/shared/shared.module';
import { UserModule } from '@modules/user/user.module';
import { ManagerModule } from '@modules/manager/manager.module';
import { QuestionModule } from '@modules/question/question.module';
import { PatientModule } from '@modules/patient/patient.module';
import { AnswerModule } from '@modules/answer/answer.module';
import { CommentModule } from '@modules/comment/comment.module';
import { FeedbackModule } from '@modules/feedback/feedback.module';

const IS_PROD = APP_ENV === 'production';

@Module({
    imports: [
        GraphQLModule.forRoot({
            fieldResolverEnhancers: ['guards', 'interceptors'],
            path: 'graphql',
            autoSchemaFile: true,
            sortSchema: true,
            cors: {
                origin: '*',
                credentials: true,
            },
            cache: 'bounded',
            buildSchemaOptions: {
                numberScalarMode: 'integer',
            },
            context: ({ request, reply }) => ({ request, reply }),
            playground: false,
            introspection: !IS_PROD,
            plugins: [IS_PROD ? ApolloServerPluginLandingPageDisabled() : ApolloServerPluginLandingPageLocalDefault()],
        }),
        SharedModule,
        InfrastructureModule,
        DatabaseModule,
        AuthModule,
        FileModule,
        NotificationModule,
        UserModule,
        DoctorModule,
        ManagerModule,
        QuestionModule,
        PatientModule,
        AnswerModule,
        CommentModule,
        FeedbackModule,
    ],
    providers: [],
    exports: [],
})
export class AppModule {}
