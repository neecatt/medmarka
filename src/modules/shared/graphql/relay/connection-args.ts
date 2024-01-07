import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ConnectionArgs {
    @Field({ nullable: true })
    page?: number;

    @Field({ nullable: true })
    pageSize?: number;
}
