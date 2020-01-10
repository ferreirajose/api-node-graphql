import { Server } from 'http';
import { port } from './../index';

export const normalizePort = (val: number | string): number | string | boolean => {
  const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

export const onError = (server: Server) => {
  return (error: NodeJS.ErrnoException): void => {
    
    if (error.syscall !== 'listen') throw error;
    const bind = (typeof port === 'string') ? `pipe ${port}` : `port ${port}`;
    
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
};

export const onListening = (server: Server) => {
  return (): void => {
    const addr = server.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening at ${bind}...`);
  };
};

export const handlerError = (erro: Error) => {
  let errorMensagem = `${erro.name}: ${erro.message}`;
  
  process.env.NODE_ENV !== 'test' || console.log(errorMensagem);

  return Promise.reject(new Error(errorMensagem))
}

export const throwErro = (condition: boolean, msn: string) => {
  if (condition) {
    throw new Error(msn);
  }
}

export const JWT_SECRET = process.env.JWT_SECRET || '';