import { InterfaceType, Field, ID } from '@nestjs/graphql';

@InterfaceType()
export abstract class RelayNode {
    @Field(() => ID)
    id: string;
}
