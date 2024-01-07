// import { Injectable } from '@nestjs/common';
// import { Brackets, SelectQueryBuilder } from 'typeorm';
// import { AmountRangeWhereInput } from '@modules/bid/graphql/types/amount-range-where-input';

// @Injectable()
// export class FilterService {
//     filterByKeyword<T>(
//         queryBuilder: SelectQueryBuilder<T>,
//         keyword: string,
//         column: string,
//         similarity = false,
//         similarityPercent = 0.6,
//     ): void {
//         if (keyword) {
//             queryBuilder.where(
//                 new Brackets((qb) => {
//                     qb.andWhere(`${column} ILIKE :keyword`, {
//                         keyword: `%${keyword}%`,
//                     });

//                     if (similarity) {
//                         qb.orWhere(`SIMILARITY(:keyword, ${column}) > ${similarityPercent}`, { keyword });
//                     }
//                 }),
//             );
//         }
//     }

//     filterByAmount<T>(queryBuilder: SelectQueryBuilder<T>, where: AmountRangeWhereInput, column: string): void {
//         if (where?.from) {
//             queryBuilder.andWhere(`${column} >= :from`, where);
//         }

//         if (where?.to) {
//             queryBuilder.andWhere(`${column} <= :to`, where);
//         }
//     }
// }
