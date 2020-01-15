import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from './../../../src/utils/utils';
import { db, app, handlerError, expect } from './../../teste-utils';

import { UserInstance } from './../../../src/models/UserModel';
import { PostInstance } from './../../../src/models/PostModel';
import { CommentInstance } from './../../../src/models/CommentModel';

describe('Comments', () => {
    let userId: number;
    let postId: number;
    let commentId: number;
    let token: string;

    beforeEach(() => {
        return db.Comment.destroy({where: {}}) // limpando tabela de Commentes
            .then((rows: number) => db.Post.destroy({where: {}})) // limpando tabela de Commentes
            .then((rows: number) => db.User.destroy({where: {}})) // limpando tabela de Commentes
            .then((rows) => db.User.create(
                {
                    name: 'Rocket',
                    email: 'rocket@guardians.com',
                    password: '1234'
                }
            )).then((users: UserInstance) => {
                userId = users[0].get('id');
                const payload = {sub: userId};

                token = jwt.sign(payload, JWT_SECRET);
                return db.Post.create(
                    {
                        title: '7 competências esperadas de um desenvolvedor back-end',
                        content: '',
                        author: userId,
                        photo: 'some_photo'
                        
                    }).then((posts: PostInstance) => {
                    postId = posts.get('id');
                    return db.Comment.bulkCreate([
                        {
                            comment: 'First Comment',
                            user: userId,
                            post: postId
                        },
                        {
                            comment: 'Second Comment',
                            user: userId,
                            post: postId
                        },
                        {
                            comment: 'Third Comment',
                            user: userId,
                            post: postId
                        },
                        {
                            comment: 'Fourth Comment',
                            user: userId,
                            post: postId
                        }
                    ]);
                }).then((comments: Array<CommentInstance>) => {
                    commentId = comments[0].get('id');
                });
            }).catch(handlerError);
    });

    describe('Queries', () => {
        
        describe('application/json', () => {
            describe('commentsByPost', () => {
               it('Should return a list of comments', () => {
                    let body = {
                        query: `
                            query getCommentsByPostList($postId: ID!, $first: Int, $offset: Int) {
                                commentsByPost(postId: $postId, first: $first, offset: $offset) {
                                    comment
                                    user {
                                        id
                                    }
                                    post {
                                        id
                                    }
                                }
                            }
                        `, variables: {
                            postId: postId
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {

                            const commentList = res.body.data.commentsByPost;

                            expect(res.body.data).to.be('object');
                            expect(commentList).to.be.an('array');
                            expect(commentList[0]).to.not.have.keys(['id', 'createdAt', 'updatedAt']);
                            expect(commentList[0]).to.have.keys(['comment', 'user', 'post']);
                            expect(Number(commentList[0].user.id)).to.equal(userId);
                            expect(Number(commentList[0].post.id)).to.equal(postId);

                        }).catch(handlerError);
               });
            });
        });
    });

    describe('Mutations', () => {
        describe('application/json', () => {
            describe('createCommint', () => {
                it('should create a new comment', () => {
                    let body = {
                        query: `
                            query createNewComment($input: CommentInput!) {
                                createComment(input: $input) {
                                    comment
                                    user {
                                        id
                                        name
                                    }
                                    post {
                                        id
                                        title
                                    }
                                }
                            }
                        `, variables: {
                            input: {
                                comment: 'First comment',
                                post: postId
                            }
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {

                            const createdComment = res.body.data.createComment;

                            expect(res.body.data).to.be('object');
                            expect(res.body.data).to.have.key('createComment');
                            expect(createdComment).to.be.an('object');
                            expect(createdComment).to.have.keys(['comment', 'user', 'post']);
                            expect(createdComment.user.id).to.equal(userId);
                            expect(createdComment.user.name).to.equal(userId);
                            expect(createdComment.post.id).to.equal(postId);
                            expect(createdComment.post.title).to.equal('First post');

                        }).catch(handlerError);
                });
            });

            describe('updateCommint', () => {
                it('should update an existing comment', () => {
                    let body = {
                        query: `
                            query createNewComment($input: CommentInput!) {
                                updateComment(input: $input) {
                                    comment
                                    user {
                                        id
                                        name
                                    }
                                    post {
                                        id
                                        title
                                    }
                                }
                            }
                        `, variables: {
                            input: {
                                comment: 'Comment changed',
                                post: postId
                            }
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {

                            const updateComment = res.body.data.updateComment;

                            expect(res.body.data).to.be('object');
                            expect(res.body.data).to.have.key('updateComment');
                            expect(updateComment).to.be('object');
                            expect(updateComment).to.have.keys(['id', 'comment']);
                            expect(updateComment.comment).to.equal('Comment changed');
                        }).catch(handlerError);
                });
            });

            describe('deleteCommint', () => {
                it('should delete an existing comment', () => {
                    let body = {
                        query: `
                            query deleteExistingComment($id: ID!) {
                                deleteComment(id: $id)
                            }
                        `, 
                        variables: {
                            id: commentId
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {

                            const deleteComment = res.body.data.deleteComment;

                            expect(res.body.data).to.be('object');
                            expect(res.body.data).to.have.key('deleteComment');
                            expect(deleteComment).to.be.true;
                            
                        }).catch(handlerError);
                });
            });
        });
    });


});