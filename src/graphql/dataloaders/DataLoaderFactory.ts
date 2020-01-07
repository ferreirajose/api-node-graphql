import * as DataLoader from 'dataloader';

import { RequestedFields } from './../ast/RequestFields';

import { PostInstance } from '../../models/PostModel';
import { UserInstance } from './../../models/UserModel';

import { PostLoader } from './PostLoader';
import { UserLoader } from './UserLoaders';

import { DataLoadersInterface } from './../../interfaces/DataLoadersInterface';
import { DbConnectionInterface } from './../../interfaces/DbConnectionInterface';
import { DataLoaderParamInterface } from './../../interfaces/DataLoaderParamInterface';
export class DataLoaderFactory {

    constructor(
        private db: DbConnectionInterface,
        private requestedFields: RequestedFields
    ) {}

    public getLoaders(): DataLoadersInterface {
        return {
            userLoader: new DataLoader<DataLoaderParamInterface<number>, UserInstance>(
                (params: DataLoaderParamInterface<Array<number>>) => UserLoader.batchUser(this.db.User, params, this.requestedFields), {
                    cacheKeyFn: (param: DataLoaderParamInterface<Array<number>>) => param.key 
                }
            ),
            postLoader: new DataLoader<DataLoaderParamInterface<number>, PostInstance>(
                (params: DataLoaderParamInterface<Array<number>>) => PostLoader.batchUser(this.db.Post, params, this.requestedFields), {
                    cacheKeyFn: (param: DataLoaderParamInterface<Array<number>>) => param.key 
                }
            )
        };
    }
}