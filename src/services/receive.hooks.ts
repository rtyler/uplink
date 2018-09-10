import { HooksObject } from '@feathersjs/feathers';

export const receiveHooks : HooksObject = {
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
