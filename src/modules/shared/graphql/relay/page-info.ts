import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
    @Field()
    page: number;

    @Field()
    totalPages: number;

    @Field()
    hasNextPage: boolean;

    @Field()
    hasPreviousPage: boolean;
}
