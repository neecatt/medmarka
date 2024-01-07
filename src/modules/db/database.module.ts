import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DbContext } from './db-context';
import { postgresConnectionOptions } from './postgres-connection-options';
import { RolesSeeder, SettingsSeeder, UsersSeeder } from './seeders';
import { SeederService } from './services/seeder.service';
import { Doctor } from '@modules/doctor/domain/models/doctor.entity';
import { FileInfo } from '@modules/file/domain/models/file-info.entity';
import { Device } from '@modules/user/domain/models/device.entity';
import { Role } from '@modules/user/domain/models/role.entity';
import { SettingGroup } from '@modules/user/domain/models/setting-group.entity';
import { Setting } from '@modules/user/domain/models/setting.entity';
import { UserDetails } from '@modules/user/domain/models/user-detail.entity';
import { User } from '@modules/user/domain/models/user.entity';
import { Patient } from '@modules/patient/domain/models/patient.entity';
import { Manager } from '@modules/manager/domain/models/manager.entity';
import { Question } from '@modules/question/domain/models/question.entity';
import { Tag } from '@modules/question/domain/models/tag.entity';
import { Answer } from '@modules/answer/domain/models/answer.entity';
import { AnswerLike } from '@modules/answer/domain/models/answer-like.entity';
import { QuestionDislike } from '@modules/question/domain/models/question-dislike.entity';
import { AnswerDislike } from '@modules/answer/domain/models/answer-dislike.entity';

const entities = [
    Role,
    User,
    Device,
    SettingGroup,
    Setting,
    FileInfo,
    UserDetails,
    Doctor,
    Patient,
    Manager,
    Question,
    Tag,
    Answer,
    AnswerLike,
    QuestionDislike,
    AnswerDislike
];

const seeders = [RolesSeeder, UsersSeeder, SettingsSeeder];

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => postgresConnectionOptions,
            dataSourceFactory: async (options) => {
                if (!options) {
                    throw new Error('Invalid options passed');
                }

                return addTransactionalDataSource(new DataSource(options));
            },
        }),
        TypeOrmModule.forFeature(entities),
    ],
    providers: [DbContext, SeederService, ...seeders],
    exports: [DbContext, SeederService],
})
export class DatabaseModule { }
