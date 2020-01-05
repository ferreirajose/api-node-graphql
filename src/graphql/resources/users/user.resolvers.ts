import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'sequelize';

import db from '../../../models/index';

import { handlerError } from '../../../utils/utils';

import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { UserInstance } from '../../../models/UserModel';
import { GenericInterface } from '../../../interfaces/GenericInterface';
import { compose } from '../../composable/composable.resolver';
import { authResolver } from '../../composable/auth.resolver';
import { verifyTokenResolver } from '../../composable/verify-token.resolver';

export const userResolvers = {
    User: {
        posts: (user: UserInstance, { first = 10, offest = 10}: GenericInterface,  info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                    where: { author: user.get('id')},
                    limit: first,
                    offset: offest
                }
            ).catch(handlerError);
        },
    },
    Query: {
        /**
         * Retorna todos os usuarios
         */
        users: compose(authResolver, verifyTokenResolver)((user: UserInstance, { first = 10, offest = 10}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.User.findAll({
                    limit: first,
                    offset: offest
                }
            ).catch(handlerError);
        }),

        user: (user: UserInstance, {id}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.User.findById(Number(id))
                .then((user: UserInstance | any) => {
                    if (!user) {
                        throw new Error(`User with: ${id} Not Found`);
                    
                    }

                    return user;
             }).catch(handlerError);
        
        }
    },
    Mutation: {
        createUser: (user: UserInstance, args: GenericInterface,  info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(args.input, {transaction: t});
            }).catch(handlerError);
        },
        updateUser: (user: UserInstance, {id, input}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(Number(id))
                    .then((user: UserInstance | null) => {
                        if (!user) {
                            throw new Error(`User with: ${id} Not Found`);
                            
                        }

                        return user.update(input, {transaction: t});
                });
            }).catch(handlerError);
        },
        updateUserPassword: (user: UserInstance, {id, input}: GenericInterface, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(Number(id)).then((user: UserInstance | null) => {
                    if (!user) {
                        throw new Error(`User with ${id} Not Found`);
                    }     

                    return user.update(input, {transaction: t}).then((user: UserInstance) => !!user);
                });
            }).catch(handlerError);
        },
        deleteUser: (user: UserInstance, {id}: GenericInterface,  info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(Number(id))
                    .then((user: UserInstance | null) => {
                        if (!user) {
                            throw new Error(`User with ${id} Not Foud`);
                        }
                        return user.destroy({transaction: t}).then((user: UserInstance | any) => !!user);
                });
            }).catch(handlerError);
        }
    }   
}