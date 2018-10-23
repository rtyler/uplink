/**
 * This service produces a list of types in the system
 */

import { Params, HooksObject } from '@feathersjs/feathers';
import service from 'feathers-sequelize';

import authorize from '../hooks/authorize';
import applyGrant from '../hooks/apply-grant';
import db from '../models';
import Type from '../models/type';

const typesHooks : HooksObject = {
  before: {
    all: [
      authorize(),
      applyGrant(),
    ],
  },
  after: {},
  error: {},
};

export default (app) => {
  const Model : any = Type(db.sequelize, db.sequelize.Sequelize);
  app.use('/types', service({ Model: Model }));
  app.service('types').hooks(typesHooks);
}
