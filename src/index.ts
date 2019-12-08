import * as http from 'http';
import * as color from 'colors';

import app from './app';
import db from './models';
import { normalizePort, onError, onListening } from './utils/utils';

const server = http.createServer(app);
const port  = normalizePort(process.env.port || 3000);

db.sequelize.sync().then(() => {  
    server.listen(port);
    server.on('error', onError(server));
    server.on('listening', onListening(server));
}).catch(erro => {
    console.log(color.red(erro), 'sequelize sync');
})


/** 
 * TypeError: Data must be a string or a buffer
 * esse erro estava sendo causado por causa da senha para acessar o DB, pois deveria ser um String
 * */ 
