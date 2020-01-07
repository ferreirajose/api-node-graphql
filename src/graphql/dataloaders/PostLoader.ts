import { RequestedFields } from './../ast/RequestFields';

import { PostModel, PostInstance } from "./../../models/PostModel";
import { DataLoaderParamInterface } from './../../interfaces/DataLoaderParamInterface';

export class PostLoader {
  static batchPosts(Post: PostModel, params: DataLoaderParamInterface<Array<number>>, requestedFields: RequestedFields): Promise<Array<PostInstance>> {      
    const ids = params.key.map(key => key);

    return Promise.resolve(
      Post.findAll({
        where: { id: { $in: ids } },
        attributes: requestedFields.getFields(params.info, {keep: ['id'], exclude: ['post']})
      })
    );
  }
}
