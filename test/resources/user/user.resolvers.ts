import { db, app, handlerError, expect } from './../../teste-utils';

describe('User', () => {
    beforeEach(() => {
        return db.Comment.destroy({where: {}}) // limpando tabela de Commentes
            .then((rows: number) => db.Post.destroy({where: {}})) // limpando tabela de Commentes
            .then((rows: number) => db.User.destroy({where: {}})) // limpando tabela de Commentes
            .then((rows: number) => 
                db.User.create({
                        name: 'Peter Quill',
                        email: 'peterquil@guardians.com',
                        password: '1234'
                    }
                ));
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
                            expect(userList).to.be.an('array').of.length(1); // o retorno da requeste é atribuido a const userList, e espera-se que o dado seja array de tamanho 1, com apenas um unico obj = [{}]
                            expect(userList[0]).to.not.have.keys(['id', 'photo', 'createdAt']) // espero que o retorno, NÃO tenha um obj com as chaves = id, photo, createdAt, pois esse parametros não foram informados nas queries
                            expect(userList[0]).to.have.keys(['name', 'email']) // espero que o retorno, contenha um obj com as chaves = name, email, pois esse parametros são informados nas queries
                        }).catch(handlerError);
                });
            });
        });
    });
});