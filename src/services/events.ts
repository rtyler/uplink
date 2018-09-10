/*
 * The /receive service is responsible receiving the data POSTed from the
 * Jenkins instances and storing it in the database
 */

import db from '../models';
import Event from '../models/event';
import service from 'feathers-sequelize';
import { DataTypes } from 'sequelize';

import { HooksObject } from '@feathersjs/feathers';

export const eventsHooks : HooksObject = {
  before: {
    all: [],
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
  const Model : any = Event(db.sequelize, db.sequelize.Sequelize);
  app.use('/events', service({ Model }));
  app.service('events').hooks(eventsHooks);
};
