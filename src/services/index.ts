import bulk from './bulk';
import events from './events';
import grants from './grants';
import users from './users';

export default (app) => {
  app.configure(bulk);
  app.configure(events);
  app.configure(grants);
  app.configure(users);
};
