import { DataLoaderParamInterface } from './DataLoaderParamInterface';
import * as DataLoader from 'dataloader';

import { CommentInstance } from './../models/CommentModel';
import { PostInstance } from './../models/PostModel';
import { UserInstance } from './../models/UserModel';

export interface DataLoadersInterface {
   userLoader: DataLoader<DataLoaderParamInterface<number>, UserInstance>;
   postLoader: DataLoader<DataLoaderParamInterface<number>, PostInstance>;
}