import { userMutations } from './resources/users/user.schema';
import { postMutations } from './resources/post/post.schema';
import { commentMutation } from './resources/comment/comment.schema';

const Mutation = `
    type Mutation {
        ${commentMutation}
        ${postMutations}
        ${userMutations}
    }
`;

export {
    Mutation
}