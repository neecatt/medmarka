import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { DeleteDoctorsInput } from '../types/delete-doctors-mutation-types';
import { DoctorConnectionArgs } from '../types/doctor-connection-args';
import { DoctorConnection, DoctorNode } from '../types/doctor-connection-types';
import { UpdateDoctorByAdminInput, UpdateDoctorByAdminPayload } from '../types/update-doctor-by-admin-mutation-types';
import { UpdateDoctorInput, UpdateDoctorPayload } from '../types/update-doctor-mutation-types';
import { UserLoader } from '@modules/user/loaders/user-loader';

import { AnswerConnection, AnswerNode } from '@modules/answer/graphql/types/answer-connection-types';
import { AnswerLoader } from '@modules/answer/loaders/answer.loader';
import { AuthorizeDoctor } from '@modules/auth/decorators/authorize-doctor.decorator';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { JwtDoctor } from '@modules/auth/jwt/jwt-payload';
import { DeleteDoctorsCommand } from '@modules/doctor/commands/delete-doctors.command';
import { UpdateDoctorByAdminCommand } from '@modules/doctor/commands/update-doctor-by-admin.command';
import { UpdateDoctorCommand } from '@modules/doctor/commands/update-doctor.command';
import { VerifyDoctorsCommand } from '@modules/doctor/commands/verify-doctor.command';
import { GetAllDoctorsQuery } from '@modules/doctor/queries/get-all-doctors.query';
import { GetDoctorQuery } from '@modules/doctor/queries/get-doctor.query';
import { getConnectionFromArray } from '@modules/shared/graphql/relay';
import { UserNode } from '@modules/user/graphql/types/connection-types/user-connection-types';

@Resolver(() => DoctorNode)
export class DoctorResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly userLoader: UserLoader,
        private readonly answerLoader: AnswerLoader,
    ) {}

    @AuthorizeDoctor()
    @Mutation(() => UpdateDoctorPayload)
    async updateDoctor(
        @Args('doctor') input: UpdateDoctorInput,
        @CurrentUser('doctor') doctor: JwtDoctor,
    ): Promise<UpdateDoctorPayload> {
        const command = plainToClass(UpdateDoctorCommand, input, { excludeExtraneousValues: true });
        command.doctorId = doctor.id;
        return await this.commandBus.execute(command);
    }

    @Mutation(() => UpdateDoctorByAdminPayload)
    async updateDoctorByAdmin(@Args('doctor') input: UpdateDoctorByAdminInput): Promise<UpdateDoctorByAdminPayload> {
        const command = plainToClass(UpdateDoctorByAdminCommand, input, { excludeExtraneousValues: true });
        return await this.commandBus.execute(command);
    }

    @Mutation(() => Boolean)
    async deleteDoctors(@Args('input') input: DeleteDoctorsInput): Promise<boolean> {
        return await this.commandBus.execute(new DeleteDoctorsCommand(input.ids));
    }

    @Mutation(() => Boolean)
    async verifyDoctors(@Args('id') id: string): Promise<boolean> {
        return await this.commandBus.execute(new VerifyDoctorsCommand(id));
    }

    @Query(() => DoctorNode)
    async doctor(@Args('id') id: string): Promise<DoctorNode> {
        return await this.queryBus.execute(new GetDoctorQuery(id));
    }

    @Query(() => DoctorConnection)
    async doctors(@Args() args: DoctorConnectionArgs): Promise<DoctorConnection> {
        return await this.queryBus.execute(new GetAllDoctorsQuery(args));
    }

    @ResolveField(() => UserNode)
    async user(@Parent() doctor: DoctorNode): Promise<UserNode> {
        const user = await this.userLoader.byId.load(doctor.userId);
        return plainToClass(UserNode, user);
    }

    @ResolveField(() => AnswerConnection, { nullable: true })
    async answers(@Parent() patient: DoctorNode): Promise<AnswerConnection> {
        const answers = await this.answerLoader.byUserId.load(patient.userId);
        return getConnectionFromArray(answers, AnswerNode);
    }
}
