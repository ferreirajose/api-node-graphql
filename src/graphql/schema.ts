import { makeExecutableSchema  } from 'graphql-tools';

import { merge } from 'lodash';
import * as color from 'colors';

import { Query } from './query';
import { Mutation } from './mutation';

import { userTypes } from './resources/users/user.schema';
import { postTypes } from './resources/post/post.schema';
import { commentTypes } from './resources/comment/comment.schema';

import { commentResolvers } from './resources/comment/comment.resolvers';
import { postResolvers } from './resources/post/post.resolvers';
import { userResolvers } from './resources/users/user.resolvers';


const resolvers1 = {
    ...commentResolvers,
    ...postResolvers,
    ...userResolvers
}
// console.log(resolvers1, 'rest');

// const resolvers = merge(
//     commentResolvers,
//     userResolvers,
//     postResolvers
// )


const SchemaDefinition = `
    type Schema {
        query: Query,
        mutation: Mutation,

    }
`;

export default makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        Query,
        Mutation,
        userTypes,
        postTypes,
        commentTypes
    ],
    resolvers1
});