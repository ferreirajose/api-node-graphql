import { RequestHandler, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/utils';

import db from '../../models/index';
import { UserInstance } from '../../models/UserModel';
/**
 * Função responsável por extrair token nas requisições
 */
export const extractJwtMiddleware = (): RequestHandler => {
    return(req: Request | any, res: Response, next: NextFunction): void => {
        const authorization = req.get('authorization');
        const token = authorization ? authorization.split(' ')[1] : undefined;
        
        req['context'] = {};
        req['context']['authorization'] = authorization; 

        if (!token) {
            return next();
        }

        jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
            if (!err) {
                return next();
            }

            db.User.findById(decoded.sub, {
                attributes: ['id', 'email']
            }).then((user: UserInstance | any) => {
                if (user) {
                    req['context']['authUser'] = {
                        id: user.get('id'),
                        email: user.get('email')
                    };
                }

                return next();
            });
        });
    };
};