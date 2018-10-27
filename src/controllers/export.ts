/**
 * The Export controller is responsible for generating a file download
 * containing entries matching a specific type
 */

import authentication from '@feathersjs/authentication';
import cookieParser from 'cookie-parser';

export default (app) => {
  app.post('/export',
    cookieParser(),
    authentication.express.authenticate('jwt'),
    (req, res, next) => {
      app.service('/events/bulk')
        .find({
          query: {
            type: req.body.type,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
          },
          user: (req as any).user,
        })
        .then((result) => {
          res.setHeader('Content-Disposition', `attachment; filename=${req.body.type}-${req.body.startDate}.json`);
          res.setHeader('Content-Type', 'application/json');
          res.send(result);
          res.end();
        })
        .catch(next);
    });
};
