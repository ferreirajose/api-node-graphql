import { userMutations } from './resources/users/user.schema';
import { postMutations } from './resources/post/post.schema';
import { tokenMutations } from './resources/token/token.schema';
import { commentMutation } from './resources/comment/comment.schema';

const Mutation = `
    type Mutation {
        ${commentMutation}
        ${postMutations}
        ${tokenMutations}
        ${userMutations}
    }
`;

export {
    Mutation
}