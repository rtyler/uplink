/**
 * The /events/bulk service is largely responsible for streaming responses in
 * the form of files to clients
 */

import { Application, HooksObject, Params, SKIP } from '@feathersjs/feathers';
import { BadRequest, NotFound } from '@feathersjs/errors';
import { QueryTypes } from 'sequelize';

import authorize from '../hooks/authorize';
import logger from '../logger';
import db from '../models';
import Event from '../models/event';

export const bulkHooks : HooksObject = {
  before: {
    all: [
      authorize(),
      (context) => {
        context.params.grants = context.data.grants
        return context;
      },
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
    if (!params.query.type) {
      return Promise.reject(new BadRequest('Request must have a `type` in the URL'));
    }

    const grantedTypes = params.grants.filter(g => (g == '*') || (g == params.query.type));
    if (grantedTypes.length == 0) {
      return Promise.reject(new NotFound('No data found'));
    }

    /*
     * This is clearly stupid. I have no idea how we'll query very large
     * datasets from PostgreSQL but this at least gets us _everything_
     */
    return db.sequelize.query("SELECT * FROM events WHERE type = :type AND \"createdAt\" > :startDate AND \"createdAt\" < :endDate", {
      replacements: {
        type: params.query.type,
        startDate: params.query.startDate,
        endDate: params.query.endDate,
      },
      type: QueryTypes.SELECT,
    });
  }
}


export default (app : Application) => {
  app.use('/events/bulk', new Bulk(app));
  app.service('events/bulk').hooks(bulkHooks);
};
