import * as DataLoader from 'dataloader';

import { PostInstance } from '../../models/PostModel';
import { UserInstance } from './../../models/UserModel';

import { PostLoader } from './PostLoader';
import { UserLoader } from './UserLoaders';

import { DataLoadersInterface } from './../../interfaces/DataLoadersInterface';
import { DbConnectionInterface } from './../../interfaces/DbConnectionInterface';
export class DataLoaderFactory {

    constructor(private db: DbConnectionInterface) {}

    public getLoaders(): DataLoadersInterface {
        return {
            userLoader: new DataLoader<number, UserInstance>(
                (ids: Array<number>) => UserLoader.batchUser(this.db.User, ids)
            ),
            postLoader: new DataLoader<number, PostInstance>(
                (ids: Array<number>) => PostLoader.batchUser(this.db.Post, ids)
            )
        };
    }
}