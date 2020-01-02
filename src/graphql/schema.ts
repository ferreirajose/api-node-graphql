import { makeExecutableSchema  } from 'graphql-tools';

import { merge } from 'lodash';

import { Query } from './query';
import { Mutation } from './mutation';

import { userTypes } from './resources/users/user.schema';
import { postTypes } from './resources/post/post.schema';
import { tokenTypes } from './resources/token/token.schema';
import { commentTypes } from './resources/comment/comment.schema';

import { commentResolvers } from './resources/comment/comment.resolvers';
import { tokenResolvers } from './resources/token/token.resolvers';
import { postResolvers } from './resources/post/post.resolvers';
import { userResolvers } from './resources/users/user.resolvers';

const resolvers = merge(
    commentResolvers,
    tokenResolvers,
    userResolvers,
    postResolvers
);

const SchemaDefinition = `
    type Schema {
        query: Query,
        mutation: Mutation
    }
`;

export default makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        Query,
        Mutation,
        userTypes,
        postTypes,
        tokenTypes,
        commentTypes
    ],
    resolvers
});