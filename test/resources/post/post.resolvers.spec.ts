import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../../src/utils/utils';
import { db, app, handlerError, expect } from '../../teste-utils';

import { UserInstance } from '../../../src/models/UserModel';
import { PostInstance } from '../../../src/models/PostModel';

describe('Post', () => {
    let userId: number;
    let postId: number;
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
                return db.Post.bulkCreate([
                    {
                        title: '7 competências esperadas de um desenvolvedor back-end',
                        content: '',
                        author: userId,
                        photo: 'some_photo'
                        
                    },
                    {
                        title: 'Angular: tudo sobre versões e releases',
                        content: '',
                        author: userId,
                        photo: 'some_photo'
                    },
                    {
                        title: 'Gerenciamento de estado com NgRx',
                        content: '',
                        author: userId,
                        photo: 'some_photo'
                        
                    },
                    {
                        title: 'REDUX',
                        content: '',
                        author: userId,
                        photo: 'some_photo'
                    }
                ]).then((posts: Array<PostInstance>) => {
                    postId = posts[0].get('id');
                });
            }).catch(handlerError);
    });

    describe('Queries', () => {
        describe('application/json', () => {
            describe('posts', () => {
                it('should return a list of Posts', () => {
                    const body = {
                        query: `
                            query {
                                posts {
                                    name
                                    content
                                    photo
                                }
                            }
                        `
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const postList = res.body.data.posts;

                            expect(res.body.data).to.be.an('object');
                            expect(postList).to.be.an('array');
                            expect(postList[0]).to.not.have.keys(['id', 'createdAt', 'updatedAt']);
                            expect(postList[0]).to.have.keys(['name', 'content', 'photo']);
                            expect(postList[0].title).to.equal('7 competências esperadas de um desenvolvedor back-end');
                        }).catch(handlerError)
                });
            });


            describe('post', () => {
                it('should return a single Post with your Author', () => {
                    const body = {
                        query: `
                            query getPosts($id: ID!) {
                                post(id: $id) {
                                    title
                                    author {
                                        name
                                        email
                                    }
                                    comments {
                                        comment
                                    }
                                }
                            }
                        `,
                        variables: {
                            id: postId
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const singlePost = res.body.data.post;

                            expect(res.body.data).to.have.key('post');
                            expect(singlePost).to.be.an('object');
                            expect(singlePost).to.have.keys(['title', 'author', 'comments']);
                            expect(singlePost.title).to.equal('7 competências esperadas de um desenvolvedor back-end');
                            expect(singlePost.author).to.be.an('object').with.keys(['name', 'email']);
                            expect(singlePost.author).to.be.an('object').with.not.keys(['id', 'createdAt', 'updatedAt', 'posts']);

                        }).catch(handlerError)
                });
            });
        });

        describe('application/graphl', () => {
            describe('posts', () => {
                it('should return a list of Posts', () => {
                    const query = `
                            query {
                                posts {
                                    name
                                    content
                                    photo
                                }
                            }
                        `
                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/graphl')
                        .send(query)
                        .then(res => {
                            const postList = res.body.data.posts;

                            expect(res.body.data).to.be.an('object');
                            expect(postList).to.be.an('array');
                            expect(postList[0]).to.not.have.keys(['id', 'createdAt', 'updatedAt']);
                            expect(postList[0]).to.have.keys(['name', 'content', 'photo']);
                            expect(postList[0].title).to.equal('7 competências esperadas de um desenvolvedor back-end');
                        }).catch(handlerError)
                });
                //
                it('should paginate a list of Posts', () => {
                    const query = `
                            query getPostList($first: Int, $offset: Int) {
                                posts(first: $first, offset: $offset) {
                                    name
                                    content
                                    photo
                                }
                            }
                        `;
                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/graphl')
                        .send(query)
                        .query({
                            variables: JSON.stringify({
                                first: 2,
                                offset: 1
                            })
                        })
                        .then(res => {
                            const postList = res.body.data.posts;

                            expect(res.body.data).to.be.an('object');
                            expect(postList).to.be.an('array').with.length(2);
                            expect(postList[0]).to.not.have.keys(['id', 'createdAt', 'updatedAt']);
                            expect(postList[0]).to.have.keys(['name', 'content', 'photo']);
                            expect(postList[0].title).to.equal('Angular: tudo sobre versões e releases');
                        }).catch(handlerError)
                });
            });
        });

    });

    describe('Mutation', () => {
        describe('application/json', () => {
            describe('createPost', () => {
                it('Should create a new Post', () => {
                    let body = {
                        query: `
                            mutation createNewPost($input: PostInput!) {
                                createPost(input: $input) {
                                    id
                                    title
                                    content
                                    author {
                                        name
                                        email
                                    }
                                }
                            }
                        `,
                        variables: {
                            input: {
                                title: 'Fourth Post',
                                content: 'Fourth content',
                                photo: 'some_photo'
                            }
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {

                            const createPost = res.body.data.createPost;
                            
                            expect(createPost).to.be.an('object');
                            expect(createPost).to.have.keys(['id', 'title', 'content', 'author']);
                            expect(createPost.title).to.equal('Fourth Post');
                            expect(createPost.content).to.equal('Fourth content');
                            expect(Number(createPost.author.id)).to.equal(userId);
                            
                        }).catch(handlerError);
                });
            }); 

            describe('updatePost', () => {
                it('Should update an existing Post', () => {
                    let body = {
                        query: `
                            mutation updateExistingPost($id: ID!, $input: PostInput!) {
                                updatePost(id: $id, input: $input) {
                                    title
                                    content
                                    photo
                                }
                            }
                        `,
                        variables: {
                            id: postId,
                            input: {
                                title: 'Post changed',
                                content: 'Content changed',
                                photo: 'some_photo_2'
                            }
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {

                            const updatePost = res.body.data.updatePost;
                            
                            expect(updatePost).to.be.an('object');
                            expect(updatePost).to.have.keys(['id', 'title', 'content', 'photo']);
                            expect(updatePost.title).to.equal('Post changed');
                            expect(updatePost.content).to.equal('Content changed');
                            expect(updatePost.photo).to.equal('some_photo_2');
                            
                        }).catch(handlerError);
                });
            }); 

            describe('deletePost', () => {
                it('Should delet an existing Post', () => {
                    let body = {
                        query: `
                            mutation deleteExistingPost($id: ID!) {
                                deletePost(id: $id) 
                            }
                        `,
                        variables: {
                            id: postId
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {
                            
                            expect(res.body.data).to.have.key('deletePost');
                            expect(res.body.data.deletePost).to.be.true;

                        }).catch(handlerError);
                });
            }); 
        });
    });
});