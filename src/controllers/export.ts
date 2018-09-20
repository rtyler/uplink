/**
 * The Export controller is responsible for generating a file download
 * containing entries matching a specific type
 */

import authentication from '@feathersjs/authentication';
import cookieParser from 'cookie-parser';

export default (app) => {
  app.get('/export/:type',
    cookieParser(),
    authentication.express.authenticate('jwt'),
    (req, res, next) => {
      app.service('/events/bulk')
        .find({
          query: {
            type: req.params.type,
          },
          user: (req as any).user,
        })
        .then((result) => {
          res.setHeader('Content-Disposition', `attachment; filename=${req.params.type}.json`);
          res.setHeader('Content-Type', 'application/json');
          res.send(result);
          res.end();
        });
  });
};
