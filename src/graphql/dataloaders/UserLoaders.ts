import { UserInstance, UserModel } from './../../models/UserModel';
import { LoadInterfaces } from '../../interfaces/LoadInterfaces';

export class UserLoader implements LoadInterfaces<UserModel, UserInstance> {
    // staticbatchUser(Model: UserModel, ids: number[]): Promise<UserInstance[]> {
    //     throw new Error('Method not implemented.');
    // }
    
    batchUser(User: UserModel, ids: Array<number>): Promise<Array<UserInstance>> {
        return User.findAll({
            where: { id: { $in: ids }}
        });
    }
}