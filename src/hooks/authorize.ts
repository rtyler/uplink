import authentication from '@feathersjs/authentication';
import { Forbidden } from '@feathersjs/errors';
import { SKIP } from '@feathersjs/feathers';

import logger from '../logger';

export default () => {
  return async context => {
    context = await authentication.hooks.authenticate(['jwt'])(context);

    if (context == SKIP) {
      return SKIP;
    }

    const name : string = context.params.user.github.profile.username;
    const type : string = context.params.query.type;
    return context.app.service('grants').find({
      query: {
        name: name,
        $or : [
          {
            type: type,
          },
          {
            type: '*',
          },
        ],
      },
    })
      .then((records) => {
        if (records.length === 0) {
          throw new Forbidden('Not allowed, sorry buddy');
        }
        return context;
      });
  };
};
