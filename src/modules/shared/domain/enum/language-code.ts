import { registerEnumType } from '@nestjs/graphql';

export enum Language {
    AZERBAIJANI = 'AZ',
    ENGLISH = 'EN',
    RUSSIAN = 'RU',
}

registerEnumType(Language, { name: 'Language' });
