import { Module } from '@nestjs/common';
import { UpdatePatientCommandHandler } from './commands/update-patient.command.handler';
import { PatientResolver } from './graphql/resolvers/patient.resolver';
import { DeletePatientsCommandHandler } from './commands/delete-patients.command-handler';
import { GetPatientQueryHandler } from './queries/get-patient.query-handler';
import { GetAllPatientsQueryHandler } from './queries/get-all-patients.query-handler';
import { PatientLoader } from './loaders/patient.loader';
import { UserModule } from '@modules/user/user.module';
import { FileModule } from '@modules/file/file.module';
import { AuthModule } from '@modules/auth/auth.module';
import { QuestionLoader } from '@modules/question/loaders/question.loader';

const loaders = [PatientLoader, QuestionLoader];

const resolvers = [PatientResolver];

const commandHandlers = [UpdatePatientCommandHandler, DeletePatientsCommandHandler];

const queryHandlers = [GetPatientQueryHandler, GetAllPatientsQueryHandler];

const services = [];

const providers = [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, ...services];

@Module({
    imports: [FileModule, UserModule, AuthModule],
    exports: [...loaders],
    providers,
})
export class PatientModule {}
