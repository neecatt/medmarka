import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './page-info';
import { Edge } from './edge-type';

export interface Connection<T> {
    totalCount: number;

    edges: Array<Edge<T>>;

    pageInfo: PageInfo;
}

export function ConnectionType<T>(classRef: Type<T>, Edge: new () => Edge<T>): new () => Connection<T> {
    @ObjectType({ isAbstract: true })
    abstract class ConnectionClass implements Connection<T> {
        @Field()
        totalCount: number;

        @Field(() => [Edge])
        edges: Array<Edge<T>>;

        @Field(() => PageInfo)
        pageInfo: PageInfo;
    }

    return ConnectionClass as any;
}
