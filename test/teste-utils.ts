import * as chai from 'chai';

const chaiHttp = require('chai-http');

import app from '../src/app';
import db from '../src/models/index';

chai.use(chaiHttp);
const expect = chai.expect;

const handlerError = (erro: any) => {
    const message = (erro.response) ? erro.response.res.text : erro.message || erro;

    return Promise.reject(`${erro.name}: ${message}`);
};

export {
    app,
    db,
    expect,
    handlerError
};