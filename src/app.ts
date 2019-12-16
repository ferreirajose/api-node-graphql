import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import db from './models';

// import schema from './graphql/schema-mocky';
import schema from './graphql/schema';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlware();
  }

  private middlware(): void {
    this.express.use('/graphql', (res, req: any, next) => {
          req['context'] = {};
          req['context'].db = db;
          next()
      },
      graphqlHTTP((req: any) => ({
          schema,
          graphiql: true,
          context: req['context']
      }))
    );
  }
}

export default new App().express;
