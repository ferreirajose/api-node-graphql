import * as express from 'express';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlware();
  }

  private middlware(): void {
    this.express.use('/hello', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send({
          hello: 'mother fucker',
        });
    });
  }
}

export default new App().express;
