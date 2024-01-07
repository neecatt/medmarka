import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface Edge<T> {
    node: T;
}

export function EdgeType<T>(classRef: Type<T>): new () => Edge<T> {
    @ObjectType({ isAbstract: true })
    abstract class EdgeClass implements Edge<T> {
        @Field(() => classRef)
        node: T;
    }

    return EdgeClass as any;
}
