import authentication from '@feathersjs/authentication';
import { Forbidden } from '@feathersjs/errors';
import { SKIP } from '@feathersjs/feathers';

import logger from '../logger';

export interface AuthorizeOptions {
  allowInternal?: boolean,
};

export default (options : AuthorizeOptions = {}) => {
  return async context => {

    /*
     * Allow internal API calls to skip the entire authorization process
     */
    if ((options.allowInternal) &&
        (!context.params.provider)) {
      return SKIP;
    }

    if ((process.env.NODE_ENV == 'test') &&
        (context.params.query.testing_access_token)) {
      // Remove the property to make sure it's not used in the DB query
      delete context.params.query.testing_access_token;
      return SKIP;
    }

    context = await authentication.hooks.authenticate(['jwt'])(context);

    if (context == SKIP) {
      return SKIP;
    }

    if (!context.params.user) {
      throw new Forbidden('No GitHub information, sorry');
    }

    const name : string = context.params.user.github.profile.username;
    const type : string = context.params.query.type;

    return context.app.service('grants').find({
      query: {
        name: name,
      },
    })
      .then((records) => {
        if (records.length === 0) {
          throw new Forbidden('Not allowed, sorry buddy');
        }

        if (!context.data) {
          context.data = {};
        }
        context.data.grants = records.map(r => r.type);
        return context;
      });
  };
};
