/*
 * The /events service is responsible receiving the data POSTed from the
 * Jenkins instances and storing it in the database
 */

import { Application, HooksObject } from '@feathersjs/feathers';
import service from 'feathers-sequelize';
import { Operators, DataTypes } from 'sequelize';

import authorize from '../hooks/authorize';
import applyGrant from '../hooks/apply-grant';
import logger from '../logger';
import db from '../models';
import Event from '../models/event';

export const eventsHooks : HooksObject = {
  before: {
    all: [
    ],
    find: [
      authorize(),
      applyGrant(),
    ],
    get: [
      authorize(),
      applyGrant(),
    ],
    create: [
      /*
       * The create route is unauthenticated so clients can POST events
       */
    ],
    update: [
      authorize(),
    ],
    patch: [
      authorize(),
    ],
    remove: [
      // Used internally for tests
      authorize({ allowInternal: true, }),
    ],
  },
  after: {
    create: [
      (context) => {
        return context.app.service('types')
          .create({
            type: context.data.type,
          })
        .then(() => { return context; })
        .catch((err) => {
          // hitting the UNIQUE constraint is an acceptable error
          if (!err.errors.filter(e => e.type == 'unique violation')) {
            throw err;
          }
        });
      },
    ],
  },
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
