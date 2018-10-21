/**
 * This service produces a list of types in the system
 */

import { Params, HooksObject } from '@feathersjs/feathers';

import db from '../models';
import Event from '../models/event';

const typesHooks : HooksObject = {
  before: {},
  after: {},
  error: {},
};

export class TypesService {
  async find(params : Params) : Promise<any> {
    return db.sequelize.query('SELECT DISTINCT(type) FROM events', { type: db.sequelize.QueryTypes.SELECT }).then((types) => {
      console.log('lol', types);
      if (types.length > 0) {
        return types.map(t => t.type);
      }
      return [];
    });
  }
}

export default (app) => {
  app.use('/types', new TypesService);
  app.service('types').hooks(typesHooks);
}
