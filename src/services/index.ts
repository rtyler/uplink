import events from './events';
import bulk from './bulk';
import users from './users';

export default (app) => {
  app.configure(bulk);
  app.configure(events);
  app.configure(users);
};
