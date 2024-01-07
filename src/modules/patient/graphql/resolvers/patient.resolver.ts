import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { PatientConnection, PatientNode } from '../types/patient-connection-types';
import { UpdatePatientInput, UpdatePatientPayload } from '../types/update-patient-mutation-types';
import {
    UpdatePatientByAdminInput,
    UpdatePatientByAdminPayload,
} from '../types/update-patient-by-admin-mutation-types';
import { DeletePatientsInput } from '../types/delete-patients-mutation-types';
import { PatientConnectionArgs } from '../types/patient-connection-args';
import { AuthorizePatient } from '@modules/auth/decorators/authorize-patient.decorator';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { JwtPatient } from '@modules/auth/jwt/jwt-payload';
import { UpdatePatientCommand } from '@modules/patient/commands/update-patient.command';
import { AuthorizePermissions } from '@modules/auth/decorators/authorize-permission.decorator';
import { PermissionName } from '@modules/user/domain/enums/permission-name';
import { DeletePatientsCommand } from '@modules/patient/commands/delete-patients.command';
import { GetPatientQuery } from '@modules/patient/queries/get-patient.query';
import { GetAllPatientsQuery } from '@modules/patient/queries/get-all-patients.query';
import { QuestionConnection, QuestionNode } from '@modules/question/graphql/types/question/question-connection-types';
import { getConnectionFromArray } from '@modules/shared/graphql/relay';
import { QuestionLoader } from '@modules/question/loaders/question.loader';
import { UserLoader } from '@modules/user/loaders/user-loader';
import { UserNode } from '@modules/user/graphql/types/connection-types/user-connection-types';

@Resolver(() => PatientNode)
export class PatientResolver {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        private readonly questionLoader: QuestionLoader,
        private readonly userLoader: UserLoader,
    ) { }

    @AuthorizePatient()
    @Mutation(() => UpdatePatientPayload)
    async updatePatient(
        @Args('patient') input: UpdatePatientInput,
        @CurrentUser('patient') patient: JwtPatient,
    ): Promise<UpdatePatientPayload> {
        const command = plainToClass(UpdatePatientCommand, input, { excludeExtraneousValues: true });
        command.patientId = patient.id;
        return await this.commandBus.execute(command);
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_UPDATE)
    @Mutation(() => UpdatePatientByAdminPayload)
    async updatePatientByAdmin(
        @Args('patient') input: UpdatePatientByAdminInput,
    ): Promise<UpdatePatientByAdminPayload> {
        const command = plainToClass(UpdatePatientCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @AuthorizePermissions(PermissionName.COMMON_SETTINGS_UPDATE)
    @Mutation(() => Boolean)
    async deletePatients(@Args('input') input: DeletePatientsInput): Promise<boolean> {
        return await this.commandBus.execute(new DeletePatientsCommand(input.ids));
    }

    @Query(() => PatientNode)
    async patient(@Args('id') id: string): Promise<PatientNode> {
        return await this.queryBus.execute(new GetPatientQuery(id));
    }

    @Query(() => PatientConnection)
    async patients(@Args() connectionArgs: PatientConnectionArgs): Promise<PatientConnection> {
        return await this.queryBus.execute(new GetAllPatientsQuery(connectionArgs));
    }

    @ResolveField(() => QuestionConnection, { nullable: true })
    async questions(@Parent() patient: PatientNode): Promise<QuestionConnection> {
        const questions = await this.questionLoader.byPatientId.load(patient.id);
        return getConnectionFromArray(questions, QuestionNode);
    }

    @ResolveField(() => UserNode)
    async user(@Parent() patient: PatientNode): Promise<UserNode> {
        const user = await this.userLoader.byId.load(patient.userId);
        return plainToClass(UserNode, user);
    }
}
