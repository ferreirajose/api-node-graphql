import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'sequelize';

import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';
import { UserInstance } from '../../../models/UserModel';

export const userResolvers = {
    User: {
        posts: (user: UserInstance, { first = 10, offest = 10}: any, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                    
                    where: { author: user.get('id')},
                    limit: first,
                    offset: offest
                }
            );
        },
    },
    Query: {
        /**
         * Retorna todos os usuarios
         */
        users: (user: UserInstance, { first = 10, offest = 10}: any, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.User.findAll({
                    limit: first,
                    offset: offest
                }
            );
        },
        user: (user: UserInstance, { id }: any, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.User.findById(id)
                .then((user: UserInstance | null) => {
                    if (!user) {
                        throw new Error(`User with: ${id} Not Found`);
                    }

                    return user;
                }
            );
        }
    },
    Mutation: {
        createUser: (user: UserInstance, args, {db} : {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(args.input, {transaction: t});
            });
        },
        updateUser: (user: UserInstance, {id, input}: {id: number, input: any}, {db} : {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(Number(id))
                    .then((user: UserInstance | null) => {
                        if (!user) {
                            throw new Error(`User with: ${id} Not Found`);
                            
                        }

                        return user.update(input, {transaction: t});
                });
            });
        },
        updateUserPassword: (user: UserInstance, {id, input}: {id: number, input: any}, {db} : {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(Number(id)).then((user: UserInstance | null) => {
                    if (!user) {
                        throw new Error(`User with ${id} Not Found`);
                    }     

                    return user.update(input, {transaction: t}).then((user: UserInstance) => !!user);
                });
            });
        },
        deleteUser: (user: UserInstance, {id}: {id: number}, {db}: {db: DbConnectionInterface}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(id)
                    .then((user: UserInstance | null) => {
                        if (!user) {
                            throw new Error(`User with ${id} Not Foud`);
                        }
                        return user.destroy({transaction: t}).then((user: UserInstance | any) => !!user);
                });
            })
        }
    }
}   