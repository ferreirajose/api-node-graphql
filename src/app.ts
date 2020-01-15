import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as cors from 'cors';
import * as compression from 'compression';
import * as helmet from 'helmet';


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
    this.requestedFields = new RequestedFields();
    this.dataLoaderFactory = new DataLoaderFactory(db, this.requestedFields);
    this.middlware();
  }
  
  private middlware(): void {
    this.express.use(cors({
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Enconding'],
      preflightContinue: false,
      optionsSuccessStatus: 204
    }));

    this.express.use(compression());
    this.express.use((helmet()));

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
