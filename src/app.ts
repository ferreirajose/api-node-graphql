import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import db from './models/index';

// import schema from './graphql/schema-mocky';
import schema from './graphql/schema';
import { extractJwtMiddleware } from './graphql/middlewares/extract-jwt.middleware';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlware();
  }

  private middlware(): void {
    this.express.use('/graphql', 
      extractJwtMiddleware(),
      (res, req: any, next) => {
          //req['context'].db = db;
          next();
         // console.log(req.context.db.sequelize, 'req')
      },
      graphqlHTTP((req: any) => ({
          schema,
          graphiql: true
      }))

    );
  }
}

export default new App().express;
