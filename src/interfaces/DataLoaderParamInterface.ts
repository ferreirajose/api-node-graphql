import { GraphQLResolveInfo } from 'graphql';

export interface DataLoaderParamInterface<T> {
    key: T,
    info: GraphQLResolveInfo
}