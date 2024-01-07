import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class MarkAsReadInput {
    @Field(() => ID)
    id: string;

    @Field(() => Boolean)
    isRead: boolean;
}

@ObjectType()
export class MarkAsReadPayload {
    @Field()
    success: boolean;
}
