const rp = require('request-promise');
const url = require('url');
const app = require('../src/app');

const port = app.get('port') || 3030;
const getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Feathers application tests', () => {
  beforeEach(function(done) {
    this.server = app.listen(port);
    this.server.once('listening', () => done());
  });

  afterEach(function(done) {
    this.server.close(done);
  });

  it('starts and shows the index page', () => {
    return rp(getUrl()).then(body =>
      expect(body.indexOf('<html>')).not.toEqual(-1)
    );
  });

  describe('404', function() {
    it('shows a 404 HTML page', () => {
      return rp({
        url: getUrl('path/to/nowhere'),
        headers: {
          'Accept': 'text/html'
        }
      }).catch(res => {
        expect(res.statusCode).toEqual(404);
        expect(res.error.indexOf('<html>')).not.toEqual(-1);
      });
    });

    it('shows a 404 JSON error without stack trace', () => {
      return rp({
        url: getUrl('path/to/nowhere'),
        json: true
      }).catch(res => {
        expect(res.statusCode).toEqual(404);
        expect(res.error.code).toEqual(404);
        expect(res.error.message).toEqual('Page not found');
        expect(res.error.name).toEqual('NotFound');
      });
    });
  });
});
