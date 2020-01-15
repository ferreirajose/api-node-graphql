import { RequestedFields } from './../../ast/RequestFields';
import { throwErro } from './../../../utils/utils';
import { DataLoadersInterface } from './../../../interfaces/DataLoadersInterface';
import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'sequelize';

import db from '../../../models/index';
import { handlerError } from '../../../utils/utils';

import { CommentInstance } from '../../../models/CommentModel';
import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { GenericInterface } from '../../../interfaces/GenericInterface';
import { compose } from '../../composable/composable.resolver';

export const commentResolvers = {
    Comment: {
        user: (comment: CommentInstance, args: GenericInterface, {db1, dataloaders: {userLoader}}: {db1: DbConnectionInterface, dataloaders: DataLoadersInterface}, info: GraphQLResolveInfo) => {
            return userLoader
                .load({
                    key: comment.get('user'),
                    info
                }).catch(handlerError);
        },
        post: (comment: CommentInstance, args: GenericInterface, {db1, dataloaders: {postLoader}}: {db1: DbConnectionInterface, dataloaders: DataLoadersInterface}, info: GraphQLResolveInfo) => {
            return postLoader
                .load({
                    key: comment.get('post'),
                    info
                }).catch(handlerError);
        }
    },
    Query: {
        commentsByPost: compose()((comment: CommentInstance, {id, first = 10, offset = 0}: GenericInterface, {requestedFields}: {requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: { post: id},
                limit: first,
                offset: offset,
                attributes: requestedFields.getFields(info, {keep: undefined})
            }).catch(handlerError);
        })
    },
    Mutation: {
        createComment: (comment: CommentInstance, {input}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.create(input, {transaction: t})
            }).catch(handlerError);
        },
        updateComment: (comment: CommentInstance, {id, input}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(Number(id))
                    .then((comment: CommentInstance | any) => {
                        throwErro(!comment, `Comment with: ${id} Not Found`);
                        return comment.update(input, {transaction: t});
                    }
                );
            }).catch(handlerError);
        },
        deleteComment: (comment: CommentInstance, {id, input}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(Number(id))
                    .then((comment: CommentInstance | any) => {
                        throwErro(!comment, `Comment with: ${id} Not Found`);
                        return comment.destroy({transaction: t}).then((comment: CommentInstance | any) => !!comment);
                    }
                );
            }).catch(handlerError);
        }
    }
}