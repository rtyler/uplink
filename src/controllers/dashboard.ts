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
          id: -1,
        }
      }, req.query);
      const user = (req as any).user;
      const name : string = user.github.profile.username;
      const grants : Array<string> = await app.service('grants').find({ query: { name: name }});
      const types : Array<Object> = await app.service('types').find();
      const isAdmin : boolean = (grants.filter(g => g != '*').length > 0);

      const months = [];
      const today = new Date();
      /*
       * TODO: In the future this come from the first_Type table
       */
      const firstDate = new Date('2018-09-01');
      const nextDate = firstDate;

      do {
        nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
        months.push(`${nextDate.getUTCFullYear()}-${nextDate.getUTCMonth()}-01`);
      } while (nextDate < today);

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
            types: types,
            months: months,
          }))
        .catch(next);
  });
};
