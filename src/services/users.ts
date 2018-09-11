/**
 * This service is a simple little users service to provide DB-backed
 * persistence to our authentication provider
 */
import authentication from '@feathersjs/authentication';
import { HooksObject } from '@feathersjs/feathers';
import service from 'feathers-sequelize';
import { DataTypes } from 'sequelize';

import db from '../models';
import User from '../models/user';

export const usersHooks : HooksObject = {
  before: {
    all: [
      authentication.hooks.authenticate(['jwt']),
    ],
  },
  after: {
  },
  error: {
  },
};

export default (app) => {
  const Model : any = User(db.sequelize, db.sequelize.Sequelize);
  app.use('/users', service({ Model }));
  app.service('users').hooks(usersHooks);
}
