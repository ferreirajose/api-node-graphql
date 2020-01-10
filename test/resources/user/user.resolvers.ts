import { UserInstance } from './../../../src/models/UserModel';
import { db, app, handlerError, expect } from './../../teste-utils';

describe('User', () => {
    let userId: number;
    beforeEach(() => {
        return db.Comment.destroy({where: {}}) // limpando tabela de Commentes
            .then((rows: number) => db.Post.destroy({where: {}})) // limpando tabela de Commentes
            .then((rows: number) => db.User.destroy({where: {}})) // limpando tabela de Commentes
            .then((rows) => db.User.bulkCreate([
                {
                    name: 'Peter Quill',
                    email: 'peterquil@guardians.com',
                    password: '1234'
                },
                {
                    name: 'Gamora',
                    email: 'gamora@guardians.com',
                    password: '4321'
                }
            ])).then((users: Array<UserInstance>) => {
                userId = users[0].get('id');
                return userId;
            });
    });

    describe('Queries', () => {
        describe('application/json', () => {
            describe('users', () => {
                it('should return a List of Users', () => {
                    const body = {
                        query: `
                            query {
                                users {
                                    name
                                    emial
                                }
                            }
                        `
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const userList = res.body.data.users;
                            expect(res.body.data).to.be.an('object'); // espero que o retorno da request seja um object
                            // expect(userList).to.be.an('array').of.length(1); // o retorno da requeste é atribuido a const userList, e espera-se que o dado seja array de tamanho 1, com apenas um unico obj = [{}]
                            expect(userList[0]).to.not.have.keys(['id', 'photo', 'createdAt', 'updatedAt', 'posts']) // espero que o retorno, NÃO tenha um obj com as chaves = id, photo, createdAt, pois esse parametros não foram informados nas queries
                            expect(userList[0]).to.have.keys(['name', 'email']) // espero que o retorno, contenha um obj com as chaves = name, email, pois esse parametros são informados nas queries
                        }).catch(handlerError);
                });

                it('should paginat a List of Users', () => {
                    const body = {
                        query: `
                            query getUserList($first: Int, $offset: Int) {
                                users(first: $first, offset: $offset) {
                                    name
                                    email
                                    createdAt
                                }
                            }
                        `,
                        variables: {
                            first: 2,
                            offset: 1
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const usersList = res.body.data.users;
                            
                            expect(res.body.data).to.be.an('object');
                            expect(usersList).to.be.an('array').of.length(2)
                            expect(usersList[0]).to.not.have.keys(['id', 'photo', 'updatedAt', 'posts'])
                            expect(usersList[0]).to.have.keys(['name', 'email', 'createdAt'])

                        }).catch(handlerError);
                });
            });

            describe('user', () => {
                it('should return a single User', () =>{
                    const body = {
                        query: `
                            query getSingleUser($id: ID!) {
                                user(id: $id) {
                                    id
                                    name
                                    email
                                    post {
                                        title
                                    }
                                }
                            }
                        `,
                        variables: {
                            id: userId
                        }
                    }

                    return chai.request(app)
                        .post('/grapqhl')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const singleUser = res.body.data.user;
                            
                            expect(res.body.data).to.be.an('object');
                            expect(singleUser).to.be.an('object');
                            expect(singleUser).to.have.keys(['id', 'name', 'email', 'posts']);
                            expect(singleUser.name).to.equal('Peter Quill');
                            expect(singleUser.email).to.equal('peterquil@guardians.com');

                        }).catch(handlerError);
                });


                it('should only \'name\' attribute', () => {
                    const body = {
                        query: `
                            query getSingleUser($id: ID!) {
                                user(id: $id) {
                                   name
                                }
                            }
                        `,
                        variables: {
                            id: userId
                        }
                    }

                    return chai.request(app)
                        .post('/grapqhl')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const singleUser = res.body.data.user;
                            
                            expect(res.body.data).to.be.an('object');
                            expect(singleUser).to.be.an('object');
                            expect(singleUser).to.have.key('name');
                            expect(singleUser.name).to.equal('Peter Quill');
                            expect(singleUser.email).to.undefined;
                            expect(singleUser.createdAt).to.undefined;
                            expect(singleUser.posts).to.undefined;

                        }).catch(handlerError);
                });

                it('should return an error if User not exists', () => {
                    const body = {
                        query: `
                            query getSingleUser($id: ID!) {
                                user(id: $id) {
                                   name
                                   email
                                }
                            }
                        `,
                        variables: {
                            id: -1
                        }
                    }

                    return chai.request(app)
                        .post('/grapqhl')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                    
                            expect(res.body.data.user).to.be.null;
                            expect(res.body.errors).to.be.an('array');
                            expect(res.body).to.have.keys(['data', 'errors']);
                            expect(res.body.errros[0].message).to.equal('ERROR: User with id -1 Not Found');
                            
                        }).catch(handlerError);
                });

            });

        });
    });
});