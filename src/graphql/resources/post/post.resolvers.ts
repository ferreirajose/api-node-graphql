import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'sequelize';

import db from '../../../models/index';

import { handlerError } from '../../../utils/utils';

import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { PostInstance } from '../../../models/PostModel';
import { GenericInterface } from '../../../interfaces/GenericInterface';

export const postResolvers = {
    Post: {
        author: (post: PostInstance, args: GenericInterface, info: GraphQLResolveInfo) => {
            return db.User.findById(post.get('author'));
        },
        comments: (post: PostInstance, { first = 10, offset = 0}, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: { post: post.get('id')},
                limit: first,
                offset: offset
            }).catch(handlerError);
        }
    },
    Query: {
        posts: (post: PostInstance, { first = 10, offset = 0 }, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                limit: first,
                offset: offset
            }).catch(handlerError);
        },
        post: (post: PostInstance, {id}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.Post.findById(Number(id))
                .then((post: PostInstance | null) => {
                    if (!post) {
                        throw new Error(`POST with id ${id} Not Found`);   
                    }
                    return post;
                }
            ).catch(handlerError);
        }
    },
    Mutation: {
        createPost: (post: PostInstance, { input }: GenericInterface, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, { transaction: t})
            }).catch(handlerError);
        }, 
        updatePost: (post: PostInstance, {id, input}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(Number(id))
                    .then((post: PostInstance | null) => {
                        if (!post) {
                            throw new Error(`POST with id ${id} Not Found`);   
                        }
                        return post;
                    }
                );
            }).catch(handlerError);
        },
        deletePost: (post: PostInstance, {id}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(Number(id))
                    .then((post: PostInstance | null) => {
                        if (!post) {
                            throw new Error(`POST with id ${id} Not Found`);   
                        }
                        return post.destroy({transaction: t}).then((post: PostInstance | any) => !!post);
                });
            }).catch(handlerError);
        }
    }
}