import * as jwt from 'jsonwebtoken';

import db from '../../../models/index';

import { JWT_SECRET } from './../../../utils/utils';
import { UserInstance } from './../../../models/UserModel';

import { GenericInterface } from './../../../interfaces/GenericInterface';
//import { DbConnectionInterface } from '../../../interfaces/DbConnectionInterface';

export const tokenResolvers = {
    Mutation: {
        createToken: (user: UserInstance, { email, password }: GenericInterface) => {
            return db.User.findOne({
                where: {email},
                attributes: ['id', 'password']
            }).then((user: UserInstance | null) => {
                let errorMessage = 'Unauthorized, wrong email or password!';

                if (!user || !user.isPassword(user.get('password'), password)) {
                    throw new Error(errorMessage);
                }

                const payload = {sub: user.get('id')};

                return {
                    token: jwt.sign(payload, JWT_SECRET)
                }
            });
        }
    }
};