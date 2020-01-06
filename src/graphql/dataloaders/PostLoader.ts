import { PostModel, PostInstance } from './../../models/PostModel';
import { LoadInterfaces } from '../../interfaces/LoadInterfaces';

export class PostLoader  implements LoadInterfaces<PostModel, PostInstance>{
    batchUser(Post: PostModel, ids: number[]): Promise<PostInstance[]> {
        return Post.findAll({
            where: { id: { $in: ids }}
        });
    }
}