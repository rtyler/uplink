import url from 'url';
import request from 'request-promise';

import app from '../src/app';
import events from '../src/service/events';

// Offsetting a bit to ensure that we can watch and run at the same time
const port = (app.get('port') || 3030) + 10;
const getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Acceptance tests for /events', () => {
  beforeEach((done) => {
    this.server = app.listen(port);
    this.server.once('listening', () => done());
  });
  afterEach(done => this.server.close(done));

  it('responds to GET /events', () => {
    return request(getUrl('/events'), {
      json: true,
      resolveWithFullResponse: true,
    }).then(response =>
      expect(response.statusCode).toEqual(401)
    ).catch(err =>
      expect(err.statusCode).toEqual(401)
    );
  });

  describe('POST to /events', () => {
    beforeEach(() => {
      const removalArgs = { query: { $limit: 1000 } };
      return app.service('events')
        .remove(null, removalArgs)
          .then(() => {
            return app.service('types').remove(null, removalArgs);
          });
    });

    it('should create a valid event', () => {
      return request.post(getUrl('/events'), {
        json: true,
        resolveWithFullResponse: true,
        body: {
          type: 'jest-example',
          payload: {
            generatedAt: Date.now(),
          },
          correlator: '0xdeadbeef',
        },
      }).then((response) => {
        expect(response.statusCode).toEqual(201)

        // ensure that a type has been created in the types table
        return request.get(getUrl('/types'), {
          json: true,
          resolveWithFullResponse: true,
          qs: { testing_access_token: true },
        }).then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body.length).toEqual(1);
        });
      });
    });
  });
});
