import { registerEnumType } from '@nestjs/graphql';

export enum Profession {
    CARDIOLOGIST = 'CARDIOLOGIST',
    UROLOGIST = 'UROLOGIST',
}

registerEnumType(Profession, { name: 'Profession' });
