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
    async (req, res, next) => {
      const query = Object.assign({
        $sort: {
          createdAt: -1,
        }
      }, req.query);
      const user = (req as any).user;
      const name : string = user.github.profile.username;
      const grants : Array<string> = await app.service('grants').find({ query: { name: name }});
      const isAdmin : boolean = (grants.filter(g => g != '*').length > 0);

      app.service('events')
        .find({
          query: query,
          // propogate our user object down
          user: user,
        })
        .then(result =>
          res.render('dashboard', {
            events: result,
            user: user,
            query: req.query,
            isAdmin: isAdmin,
            grants: grants,
          }))
        .catch(next);
  });
};
