import events from './events';
import users from './users';

export default (app) => {
  app.configure(events);
  app.configure(users);
};
