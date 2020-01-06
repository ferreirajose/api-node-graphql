import * as DataLoader from 'dataloader';

import { CommentInstance } from './../models/CommentModel';
import { PostInstance } from './../models/PostModel';
import { UserInstance } from './../models/UserModel';

export interface DataLoadersInterface {
   userLoader: DataLoader<number, UserInstance>;
   postLoader: DataLoader<number, PostInstance>;
   commentLoader: DataLoader<number, CommentInstance>;
}