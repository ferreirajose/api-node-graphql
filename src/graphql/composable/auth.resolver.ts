import { GraphQLFieldResolver } from 'graphql';

import { ResolverContextInterface } from '../../interfaces/ResolverContextInterface';

import { ComposableResolver } from './composable.resolver';
import { verifyTokenResolver } from './verify-token.resolver';

export const authResolver: ComposableResolver<any, ResolverContextInterface> = 
    (resolver: GraphQLFieldResolver<any, ResolverContextInterface>): GraphQLFieldResolver<any, ResolverContextInterface> => {
        return (parent, args, context, info) => {
            if (context.authUser || context.authorization) {
                return resolver(parent, args, context, info);
            }      
            throw new Error('Unauthorized! Token Not Provided!');
        };
}; 

export const authResolvers = [authResolver, verifyTokenResolver];