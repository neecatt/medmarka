import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SelectQueryBuilder } from 'typeorm';
import { Patient } from '../domain/models/patient.entity';
import { PatientConnection, PatientNode } from '../graphql/types/patient-connection-types';
import { PatientOrderBy } from '../graphql/types/patient-order-by';
import { GetAllPatientsQuery } from './get-all-patients.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllPatientsQuery)
export class GetAllPatientsQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllPatientsQuery, PatientConnection>
{
    async execute({
        patientConnectionArgs: { orderBy, page, pageSize },
    }: GetAllPatientsQuery): Promise<PatientConnection> {
        const queryBuilder = this.dbContext.patients.createQueryBuilder('p');

        queryBuilder.leftJoin('p.user', 'u');

        queryBuilder.leftJoin('u.details', 'ud');

        this.buildOrderBy(queryBuilder, orderBy);

        // if (where?.isGetAll) {
        //     return await this.dbContext.patients.getMany(queryBuilder, PatientNode);
        // }

        const connection = await this.dbContext.patients.getManyAndPaginate(
            queryBuilder,
            { page, pageSize },
            PatientNode,
        );

        return connection;
    }

    private buildOrderBy(queryBuilder: SelectQueryBuilder<Patient>, orderBy: PatientOrderBy) {
        switch (orderBy) {
            case PatientOrderBy.CREATED_AT_ASC:
                queryBuilder.orderBy('p.created_at', 'ASC');
                break;

            case PatientOrderBy.CREATED_AT_DESC:
                queryBuilder.orderBy('p.created_at', 'DESC');
                break;

            default:
                queryBuilder.orderBy('p.created_at', 'DESC');
        }
    }
}
