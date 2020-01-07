import { PostModel, PostInstance } from './../../models/PostModel';
import { LoadInterfaces } from '../../interfaces/LoadInterfaces';

export class PostLoader {
    static batchUser(Post: PostModel, ids: number[]): Promise<PostInstance[]> {
        return Post.findAll({
            where: { id: { $in: ids }}
        });
    }
}