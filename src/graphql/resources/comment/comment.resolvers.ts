import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'sequelize';

import { handlerError } from '../../../utils/utils';

import { CommentInstance } from '../../../models/CommentModel';
import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { GenericInterface } from '../../../interfaces/GenericInterface';

export const commentResolvers = {
    Comment: {
        user: (comment: CommentInstance, args: GenericInterface, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.User.findById(comment.get('user')).catch(handlerError);
        },
        post: (comment: CommentInstance, args: GenericInterface, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.Post.findById(comment.get('post')).catch(handlerError);
        }
    },
    Query: {
        commentsByPost: (comment: CommentInstance, {id, first = 10, offest = 0}: GenericInterface, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: { post: id},
                limit: first,
                offset: offest
            }).catch(handlerError);
        }
    },
    Mutation: {
        createComment: (comment: CommentInstance, {input}: GenericInterface, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.create(input, {transaction: t})
            }).catch(handlerError);
        },
        updateComment: (comment: CommentInstance, {id, input}: GenericInterface, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(Number(id))
                    .then((comment: CommentInstance | null) => {
                        if (!comment) {
                            throw new Error(`Comment with id ${id} Not Foud`);
                        }

                        return comment.update(input, {transaction: t});
                    }
                );
            }).catch(handlerError);
        },
        deleteComment: (comment: CommentInstance, {id, input}: GenericInterface, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(Number(id))
                    .then((comment: CommentInstance | null) => {
                        if (!comment) {
                            throw new Error(`Comment with id ${id} Not Foud`);
                        }

                        return comment.destroy({transaction: t}).then((comment: CommentInstance | any) => !!comment);
                    }
                );
            }).catch(handlerError);
        }
    }
}