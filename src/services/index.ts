import receive from './receive';

export default (app) => {
  app.configure(receive);
};
