
import authentication from '@feathersjs/authentication';
import { HooksObject } from '@feathersjs/feathers';
import memory from 'feathers-memory';

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
  app.use('/users', memory());
  app.service('users').hooks(usersHooks);
}
