import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Language } from '@modules/shared/domain/enum/language-code';

@ObjectType()
@InputType('TranslatedStringInput')
export class TranslatedString {
    @Field()
    DEFAULT: string;

    @Field({ nullable: true })
    [Language.ENGLISH]?: string;

    @Field({ nullable: true })
    [Language.AZERBAIJANI]?: string;

    @Field({ nullable: true })
    [Language.RUSSIAN]?: string;
}

@ObjectType()
@InputType('TranslatedStringArrayInput')
export class TranslatedStringArray {
    @Field(() => [String])
    DEFAULT: string[];

    @Field(() => [String], { nullable: true })
    [Language.ENGLISH]?: string[];

    @Field(() => [String], { nullable: true })
    [Language.AZERBAIJANI]?: string[];

    @Field(() => [String], { nullable: true })
    [Language.RUSSIAN]?: string[];
}
