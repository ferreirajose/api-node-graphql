import * as http from 'http';
import * as color from 'colors';

import app from './app';
import db from './models';
import { normalizePort, onError, onListening } from './utils/utils';

const server = http.createServer(app);
export const port = normalizePort(process.env.port || 4000); // exportar essa constante

db.sequelize.sync().then(() => {  
    server.listen(port);
    server.on('error', onError(server));
    server.on('listening', onListening(server));
}).catch(erro => {
    console.group("Error Name");
    console.log("Sequelize sync");
    console.log(color.red(erro));
    console.groupEnd();
})


/** 
 * TypeError: Data must be a string or a buffer
 * esse erro estava sendo causado por causa da senha para acessar o DB, pois deveria ser um String
 * */ 
