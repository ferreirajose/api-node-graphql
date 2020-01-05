import { GraphQLFieldResolver } from 'graphql';

import { ComposableResolver } from './composable.resolver';
import { ResolverContextInterface } from '../../interfaces/ResolverContextInterface';

export const authResolver: ComposableResolver<any, ResolverContextInterface> = 
    (resolver: GraphQLFieldResolver<any, ResolverContextInterface>): GraphQLFieldResolver<any, ResolverContextInterface> => {
        return (parent, args, context, info) => {
            if (context.authUser || context.authorization) {
                return resolver(parent, args, context, info);
            }      
            throw new Error('Unauthorized! Token Not Provided!');
        };
}; 