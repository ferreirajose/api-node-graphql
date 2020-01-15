import { db, app, expect, handlerError } from '../../teste-utils';

describe('Token', () => {
    beforeEach(() => {
        return db.Comment.destroy({
            where: {}
        })
        .then((rows: number) => db.Post.destroy({where: {}}))
        .then((rows: number) => db.User.destroy({where: {}}))
        .then((rows: number) => db.User.create(
            {
                name: 'Peter Quill',
                email: 'peter@guardians.com',
                password: '1234'
            }
        )).catch(handlerError);
    });

    describe('Mutations', () => {
        describe('application/json', () => {
            describe('createToken', () => {
                it('Should return a new valid token', () => {
                    let body = {
                        query: `
                            mutation createNewToken($email: String!, $password!) {
                                createToken($email: email, $password: password) {
                                    token
                                }
                            }
                        `,
                        variables: {
                            email: 'peter@guardians.com',
                            password: '1234'
                        }
                    };

                    return chai.request(app)
                            .post('/graphql')
                            .set('content-type', 'application/json')
                            .send(JSON.stringify(body))
                            .then(res => {
                                expect(res.body.data).to.has.keys(['data', 'erros'])
                                expect(res.body.data).to.have.key('createToken');
                                expect(res.body.data.createToken).to.be.null;
                                expect(res.body.data.createToken.token).to.be.string;
                                expect(res.body.erros).to.be.undefined;

                            }).catch(handlerError)
                });

                it('Should return an error if the password is incorret', () => {
                    let body = {
                        query: `
                            mutation createNewToken($email: String!, $password!) {
                                createToken($email: email, $password: password) {
                                    token
                                }
                            }
                        `,
                        variables: {
                            email: 'peter@guardians.com',
                            password: 'fadfdsf'
                        }
                    };

                    return chai.request(app)
                            .post('/graphql')
                            .set('content-type', 'application/json')
                            .send(JSON.stringify(body))
                            .then(res => {
                                expect(res.body.data).to.has.keys(['data', 'erros'])
                                expect(res.body.data).to.have.key('createToken');
                                expect(res.body.data.createToken).to.be.null;
                                expect(res.body.erros).to.be.an('array').with.length(1);
                                expect(res.body.erros[0].message).to.equal('Unauthorized, Wrong email or password!');

                            }).catch(handlerError)
                });

                it('Should return an error if the email not exists', () => {
                    let body = {
                        query: `
                            mutation createNewToken($email: String!, $password!) {
                                createToken($email: email, $password: password) {
                                    token
                                }
                            }
                        `,
                        variables: {
                            email: 'dasd@guardians.com',
                            password: '1234'
                        }
                    };

                    return chai.request(app)
                            .post('/graphql')
                            .set('content-type', 'application/json')
                            .send(JSON.stringify(body))
                            .then(res => {
                                expect(res.body.data).to.has.keys(['data', 'erros'])
                                expect(res.body.data).to.have.key('createToken');
                                expect(res.body.data.createToken).to.be.null;
                                expect(res.body.erros).to.be.an('array').with.length(1);
                                expect(res.body.erros[0].message).to.equal('Unauthorized, Wrong email or password!');

                            }).catch(handlerError)
                });


            });
        });
    });
});