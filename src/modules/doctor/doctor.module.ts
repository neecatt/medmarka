import { AuthModule } from '@modules/auth/auth.module';
import { FileModule } from '@modules/file/file.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { DeleteDoctorsCommandHandler } from './commands/delete-doctors.command-handler';
import { UpdateDoctorByAdminCommandHandler } from './commands/update-doctor-by-admin.command-handler';
import { UpdateDoctorCommandHandler } from './commands/update-doctor.command-handler';
import { VerifyDoctorsCommandHandler } from './commands/verify-doctor.command-handler';
import { DoctorResolver } from './graphql/resolvers/doctor.resolver';
import { DoctorLoader } from './loaders/doctor.loader';
import { GetAllDoctorsQueryHandler } from './queries/get-all-doctors.query-handler';
import { GetDoctorQueryHandler } from './queries/get-doctor.query-handler';
import { AnswerLoader } from '@modules/answer/loaders/answer.loader';

const loaders = [DoctorLoader, AnswerLoader];

const resolvers = [DoctorResolver];

const services = [];

const commandHandlers = [
    DeleteDoctorsCommandHandler,
    UpdateDoctorByAdminCommandHandler,
    UpdateDoctorCommandHandler,
    VerifyDoctorsCommandHandler,
];

const queryHandlers = [GetDoctorQueryHandler, GetAllDoctorsQueryHandler];

@Module({
    imports: [FileModule, UserModule, AuthModule],
    providers: [...commandHandlers, ...queryHandlers, ...resolvers, ...loaders, ...services],
    exports: [...services],
})
export class DoctorModule {}
