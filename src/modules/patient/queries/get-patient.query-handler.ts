import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PatientNode } from '../graphql/types/patient-connection-types';
import { GetPatientQuery } from './get-patient.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';
import { ErrorCode } from '@modules/shared/domain/enum/error-code';

@QueryHandler(GetPatientQuery)
export class GetPatientQueryHandler extends BaseQueryHandler implements IQueryHandler<GetPatientQuery, PatientNode> {
    async execute({ id }: GetPatientQuery): Promise<PatientNode> {
        const patient = await this.dbContext.patients.findOne({ where: { id } });
        if (!patient) {
            throw new NotFoundException(ErrorCode.PATIENT_NOT_FOUND);
        }

        return plainToClass(PatientNode, patient);
    }
}
