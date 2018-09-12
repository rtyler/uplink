import authentication from '@feathersjs/authentication';
import { HooksObject } from '@feathersjs/feathers';
import service from 'feathers-sequelize';
import { DataTypes } from 'sequelize';

import db from '../models';
import Grant from '../models/grant';

export const grantHooks : HooksObject = {
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
  const Model : any = Grant(db.sequelize, db.sequelize.Sequelize);
  app.use('/grants', service({ Model }));
  app.service('grants').hooks(grantHooks);
}
