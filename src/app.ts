import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';

import schema from './graphql/schema';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlware();
  }

  private middlware(): void {
    this.express.use('/graphql', graphqlHTTP({
      schema,
      graphiql: true
    }));
  }
}

export default new App().express;
