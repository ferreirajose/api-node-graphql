import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';

import { RequestedFields } from './graphql/ast/RequestFields';
import { DataLoaderFactory } from './graphql/dataloaders/DataLoaderFactory';

import db from './models/index';

// import schema from './graphql/schema-mocky';
import schema from './graphql/schema';
import { extractJwtMiddleware } from './graphql/middlewares/extract-jwt.middleware';

class App {

  private requestedFields: RequestedFields
  private dataLoaderFactory: DataLoaderFactory;
  public express: express.Application;

  constructor() {
    this.express = express();
    this.dataLoaderFactory = new DataLoaderFactory(db);
    this.requestedFields = new RequestedFields();
    this.middlware();
  }
  
  private middlware(): void {
    this.express.use('/graphql', 

      extractJwtMiddleware(),
    
      (res, req: any, next) => {
          req['context'] = {}  
          req['context']['db'] = db;
          req['context']['dataLoaders'] = this.dataLoaderFactory.getLoaders();
          req['context']['requestedFields'] = this.requestedFields;
          next();
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
