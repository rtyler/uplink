/**
 * The /events/bulk service is largely responsible for streaming responses in
 * the form of files to clients
 */

import { Application, HooksObject, Params, SKIP } from '@feathersjs/feathers';
import { QueryTypes } from 'sequelize';

import authorize from '../hooks/authorize';
import logger from '../logger';
import db from '../models';
import Event from '../models/event';

export const bulkHooks : HooksObject = {
  before: {
    all: [
      (context) => {
        /*
         * Allow skipping for our tests
         */
        if (process.env.NODE_ENV != 'production') {
          return SKIP;
        }
        return context;
      },
      authorize(),
    ],
  },
  after: {},
  error: {},
};

/**
 * The Bulk service class intentionally only implements the find method
 */
export class Bulk {
  protected readonly app : Application;

  constructor(app : Application) {
    this.app = app;
  }

  public async find(params : Params) : Promise<any> {
    if (!params.type) {
      return Promise.resolve([]);
    }
    /*
     * This is clearly stupid. I have no idea how we'll query very large
     * datasets from PostgreSQL but this at least gets us _everything_
     */
    return db.sequelize.query("SELECT * FROM events WHERE type = :type", {
      replacements: {
        type: params.type,
      },
      type: QueryTypes.SELECT,
    });
  }
}


export default (app : Application) => {
  app.use('/events/bulk', new Bulk(app));
  app.service('events/bulk').hooks(bulkHooks);
};
