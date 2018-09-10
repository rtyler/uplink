/*
 * The /receive service is responsible receiving the data POSTed from the
 * Jenkins instances and storing it in the database
 */

import db from '../models';
import Event from '../models/event';
import service from 'feathers-sequelize';
import { DataTypes } from 'sequelize';
import { receiveHooks } from './receive.hooks';

export default (app) => {
  const Model : any = Event(db.sequelize, db.sequelize.Sequelize);
  app.use('/receive', service({ Model }));
  app.service('receive').hooks(receiveHooks);
};
