import url from 'url';
import request from 'request-promise';

import app from '../src/app';

// Offsetting a bit to ensure that we can watch and run at the same time
const port = (app.get('port') || 3030) + 10;
const getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Acceptance tests for /evetns', () => {
  beforeEach((done) => {
    this.server = app.listen(port);
    this.server.once('listening', () => done());
  });

  afterEach((done) => {
    this.server.close(done);
  });

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

  it('POST /events should allow creating a valid event', () => {
    return request(getUrl('/events'), {
      method: 'POST',
      json: true,
      resolveWithFullResponse: true,
      body: {
        type: 'jest-example',
        payload: {
          generatedAt: Date.now(),
        },
        correlator: '0xdeadbeef',
      },
    }).then(response =>
      expect(response.statusCode).toEqual(201)
    );
  });
});
