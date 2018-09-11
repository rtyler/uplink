import dashboard from './dashboard';
import events from './events';
import users from './users';

export default (app) => {
  app.configure(dashboard);
  app.configure(events);
  app.configure(users);
};
