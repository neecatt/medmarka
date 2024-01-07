import { registerEnumType } from '@nestjs/graphql';

export enum Degree {
    UZMAN = 'UZMAN',
}

registerEnumType(Degree, { name: 'Degree' });
