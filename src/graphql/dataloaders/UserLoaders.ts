import { UserInstance, UserModel } from './../../models/UserModel';
import { LoadInterfaces } from '../../interfaces/LoadInterfaces';

export class UserLoader {    
    static batchUser(User: UserModel, ids: Array<number>): Promise<Array<UserInstance>> {
        return User.findAll({
            where: { id: { $in: ids }}
        });
    }   
}