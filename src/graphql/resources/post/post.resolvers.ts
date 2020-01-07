import { throwErro } from './../../../utils/utils';
import { RequestedFields } from './../../ast/RequestFields';
import * as graphqlFields from 'graphql-fields';

import { Transaction } from 'sequelize';
import { GraphQLResolveInfo } from 'graphql';

import { PostInstance } from '../../../models/PostModel';

import db from '../../../models/index';

import { handlerError } from '../../../utils/utils';

import { GenericInterface } from '../../../interfaces/GenericInterface';
import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { DataLoadersInterface } from './../../../interfaces/DataLoadersInterface';

export const postResolvers = {
    Post: {
        author: (post: PostInstance, args: GenericInterface, {db1, dataloaders: {userLoader}}: {db1: DbConnectionInterface, dataloaders: DataLoadersInterface}, info: GraphQLResolveInfo) => {
            return userLoader
                .load({
                    key: post.get('author'),
                    info
                }).catch(handlerError);
        },
        comments: (post: PostInstance, { first = 10, offset = 0}, {requestedFields}: {requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: { post: post.get('id')},
                limit: first,
                offset: offset,
                attributes: requestedFields.getFields(info)
            }).catch(handlerError);
        }
    },
    Query: {
        posts: (post: PostInstance, { first = 10, offset = 0 }, {requestedFields}: {requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                limit: first,
                offset: offset,
                attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
            }).catch(handlerError);
        },
        post: (post: PostInstance, {id}: GenericInterface, {requestedFields}: {requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Post.findById(Number(id), {
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
                }).then((post: PostInstance | any) => {
                    throwErro(!post, `POST with: ${id} Not Found`);
                    return post;
            }).catch(handlerError);
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