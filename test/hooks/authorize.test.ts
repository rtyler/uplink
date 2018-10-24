import { SKIP } from '@feathersjs/feathers';
import { Forbidden } from '@feathersjs/errors';

import authorize from '../../src/hooks/authorize';

describe('The `authorize` hook', () => {
  let context = null;
  let mockServices = {};
  const mockApp = {
    authenticate: () => {
      return () => { return Promise.resolve({}); };
    },
    passport: {
      _strategy: () => { return ['jwt'] },
      options: () => { },
    },
    service: (name) => { return mockServices; },
  };

  beforeEach(() => {
    context = {
      type: 'before',
      app: mockApp,
      params: {
        query: {},
      },
      data: {
      },
    };
  })

  describe('in testing mode', () => {
    it('should not skip when a `testing_access_token` is omitted', () => {
      return expect(authorize()(context)).rejects.toThrow(Forbidden);
    });

    it('should SKIP when a `testing_access_token` is provided', () => {
      context.params.query.testing_access_token = true;
      return expect(authorize()(context)).resolves.toEqual(SKIP);
    });
  });

  describe('with the allowInternal option', () => {
    it('should not skip for external API calls', () => {
      context.params.provider = 'rest';
      return expect(authorize({ allowInternal: true })(context))
        .rejects.toThrow(Forbidden);
    });

    it('should SKIP for internal API calls', () => {
      return expect(authorize({ allowInternal: true })(context))
        .resolves.toEqual(SKIP);
    });
  });
});
