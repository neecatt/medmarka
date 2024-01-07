import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { DoctorNode } from '../graphql/types/doctor-connection-types';
import { GetDoctorQuery } from './get-doctor.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@QueryHandler(GetDoctorQuery)
export class GetDoctorQueryHandler extends BaseQueryHandler implements IQueryHandler<GetDoctorQuery, DoctorNode> {
    async execute({ id }: GetDoctorQuery): Promise<DoctorNode> {
        const doctor = await this.dbContext.doctors.findOneBy({ id });

        if (!doctor) {
            throw new NotFoundException(ErrorCode.DOCTOR_NOT_FOUND);
        }

        return plainToClass(DoctorNode, doctor);
    }
}
