import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import * as jwt from 'jsonwebtoken';

import { ComposableResolver } from './composable.resolver';
import { ResolverContextInterface } from '../../interfaces/ResolverContextInterface';
import { JWT_SECRET } from '../../utils/utils';

export const verifyTokenResolver: ComposableResolver<any, ResolverContextInterface> = 
    (resolver: GraphQLFieldResolver<any, ResolverContextInterface>): GraphQLFieldResolver<any, ResolverContextInterface> => {
        return(parent, args, context: ResolverContextInterface, info: GraphQLResolveInfo) => {

            const token = context.authorization ? context.authorization.split(' ')[1] : 'undefined';

            return jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (!err) {
                    return resolver(parent, args, context, info);
                }

                throw new Error(`${err.name}: ${err.message}`);

            });
        };
} 