import { SKIP } from '@feathersjs/feathers';
import { Forbidden } from '@feathersjs/errors';

import authorize from '../../src/hooks/authorize';

describe('The `authorize` hook', () => {
  let context = null;
  let mockServices = {};
  const mockApp = {
    service: (name) => { return mockServices; },
  };

  beforeEach(() => {
    context = {
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
});
