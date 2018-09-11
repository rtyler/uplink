/*
 * The /receive service is responsible receiving the data POSTed from the
 * Jenkins instances and storing it in the database
 */

import authentication from '@feathersjs/authentication';
import { Application, HooksObject } from '@feathersjs/feathers';
import service from 'feathers-sequelize';
import { DataTypes } from 'sequelize';

import db from '../models';
import Event from '../models/event';

export const eventsHooks : HooksObject = {
  before: {
    all: [
    ],
    find: [
      authentication.hooks.authenticate(['jwt']),
    ],
    get: [
      authentication.hooks.authenticate(['jwt']),
    ],
    create: [
      /*
       * The create route is unauthenticated so clients can POST events
       */
    ],
    update: [
      authentication.hooks.authenticate(['jwt']),
    ],
    patch: [
      authentication.hooks.authenticate(['jwt']),
    ],
    remove: [
      authentication.hooks.authenticate(['jwt']),
    ],
  },
  after: {},
  error: {},
};

export default (app : Application) => {
  const Model : any = Event(db.sequelize, db.sequelize.Sequelize);
  app.use('/events', service({
    Model: Model,
    paginate: {
      default: 25,
  }}));
  app.service('events').hooks(eventsHooks);
};
