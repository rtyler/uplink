/**
 * The Dashboard module is for logged in users to view events
 */

import logger from '../logger';

import { Application, HooksObject, Params } from '@feathersjs/feathers';
import authentication from '@feathersjs/authentication';


export class Dashboard {
  protected readonly app : Application;

  constructor(app : Application) {
    this.app = app;
  }

  public async find(params : Params) : Promise<any> {
    logger.info('Parameters passed into the Dashboard service', params);
    return Promise.resolve({});
  }
}

export const dashboardHooks : HooksObject = {
  before: {
    all: [
      authentication.hooks.authenticate(['jwt']),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {},
  error: {},
};

export default (app) => {
  app.use('/dashboard', new Dashboard(app));
  app.service('dashboard').hooks(dashboardHooks);
};
