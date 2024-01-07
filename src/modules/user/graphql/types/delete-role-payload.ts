import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteRolePayload {
    @Field()
    id: string;
}
