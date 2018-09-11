import url from 'url';
import request from 'request-promise';

import app from '../src/app';
import { Bulk } from '../src/service/bulk';

// Offsetting a bit to ensure that we can watch and run at the same time
const port = (app.get('port') || 3030) + 10;
const getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Acceptance tests for /evetns/bulk', () => {
  beforeEach((done) => {
    this.server = app.listen(port);
    this.server.once('listening', () => done());
  });
  afterEach(done => this.server.close(done));

  describe('GET on /events/bulk', () => {
    it('without a type parameter should be empty', () => {
      return request(getUrl('/events/bulk'), {
        json: true,
        resolveWithFullResponse: true,
      }).then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(0);
      });
    });
  });
});
