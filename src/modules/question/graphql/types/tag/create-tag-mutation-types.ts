import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { TagNode } from './tag-connection-types';

@InputType()
export class CreateTagInput {
    @IsNotEmpty()
    @Field()
    name: string;
}

@ObjectType()
export class CreateTagPayload {
    @Field(() => TagNode)
    tag: TagNode;
}
