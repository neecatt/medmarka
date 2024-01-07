import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SelectQueryBuilder } from 'typeorm';
import { DoctorConnection, DoctorNode } from '../graphql/types/doctor-connection-types';
import { Doctor } from '../domain/models/doctor.entity';
import { DoctorWhereInput } from '../graphql/types/doctor-where-input';
import { DoctorOrderBy } from '../graphql/types/doctor-order-by';
import { GetAllDoctorsQuery } from './get-all-doctors.query';
import { BaseQueryHandler } from '@modules/shared/queries/base-query-handler';

@QueryHandler(GetAllDoctorsQuery)
export class GetAllDoctorsQueryHandler
    extends BaseQueryHandler
    implements IQueryHandler<GetAllDoctorsQuery, DoctorConnection>
{
    async execute({
        doctorConnectionArgs: { page, where, pageSize, orderBy },
    }: GetAllDoctorsQuery): Promise<DoctorConnection> {
        const queryBuilder = this.dbContext.doctors.createQueryBuilder('m');

        queryBuilder.leftJoin('m.user', 'u').leftJoin('u.userRoles', 'ur').leftJoin('ur.role', 'r');

        this.buildWhere(queryBuilder, where);

        this.buildOrderBy(queryBuilder, orderBy);

        const connection = await this.dbContext.doctors.getManyAndPaginate(
            queryBuilder,
            { page, pageSize },
            DoctorNode,
        );

        return connection;
    }

    private buildWhere(queryBuilder: SelectQueryBuilder<Doctor>, where?: DoctorWhereInput): void {
        if (where?.firstName) {
            queryBuilder.andWhere(`u.first_name ILIKE :firstName`, { firstName: `%${where.firstName}%` });
        }

        if (where?.lastName) {
            queryBuilder.andWhere(`u.last_name ILIKE :lastName`, { lastName: `%${where.lastName}%` });
        }

        if (where?.email) {
            queryBuilder.andWhere(`u.email ILIKE :email`, { email: `%${where.email}%` });
        }

        if (where?.role) {
            queryBuilder.andWhere(`r.name = :role`, where);
        }
    }

    private buildOrderBy(queryBuilder: SelectQueryBuilder<Doctor>, orderBy?: DoctorOrderBy): void {
        switch (orderBy) {
            case DoctorOrderBy.NAME_ASC:
                queryBuilder.orderBy('u.first_name', 'ASC');
                break;
            case DoctorOrderBy.NAME_DESC:
                queryBuilder.orderBy('u.first_name', 'DESC');
                break;

            default:
                queryBuilder.orderBy('m.created_at', 'DESC');
        }
    }
}
