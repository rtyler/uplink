/**
 * The Dashboard controller is responsible for stiching the /dashboard data
 * together
 */

import authentication from '@feathersjs/authentication';
import cookieParser from 'cookie-parser';

export default (app) => {
  app.get('/dashboard',
    cookieParser(),
    authentication.express.authenticate('jwt'),
    (req, res, next) => {
      let query = Object.assign({
        $sort: {
          createdAt: -1,
        }
      }, req.query);

      app.service('events')
        .find({
          query: query,
          // propogate our user object down
          user: (req as any).user,
        })
        .then(result =>
          res.render('dashboard', {
            events: result,
            user: (req as any).user,
            query: req.query,
          }))
        .catch(err => res.render('notauthorized'));
  });
};
