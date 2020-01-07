import { RequestedFields } from './../ast/RequestFields';
import { DataLoaderParamInterface } from './../../interfaces/DataLoaderParamInterface';
import { UserInstance, UserModel } from './../../models/UserModel';
import { LoadInterfaces } from '../../interfaces/LoadInterfaces';

export class UserLoader {    
    static batchUser(User: UserModel, params: DataLoaderParamInterface<Array<number>>, requestedFields: RequestedFields): Promise<Array<UserInstance>> {      
        const ids = params.key.map((key) => key);

        return Promise.resolve(
            User.findAll({
                where: { id: { $in: ids }},
                attributes: requestedFields.getFields(params.info, {keep: ['id'], exclude: ['post']})
            })
        );
    }   
}