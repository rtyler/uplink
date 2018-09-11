
import path from 'path';
import favicon from 'serve-favicon';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import logger from './logger';

import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import authentication from '@feathersjs/authentication';
import jwt from '@feathersjs/authentication-jwt';
import oauth2 from '@feathersjs/authentication-oauth2';
import { Strategy } from 'passport-github';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';

import cookieParser from 'cookie-parser';

import middleware from './middleware';
import services from './services';
import { appHooks } from './app.hooks';
import channels from './channels';

const app = express(feathers());
const settings = configuration();

// Load app configuration
app.configure(settings);
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));


// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

/*
 * Enabling the cookie parser on all requests to make sure we can use the JWT
 * authentication wherever we damn well please
 */
app.get('*', cookieParser());

/*
 * Allow overriding the JWT secret in the environment, a la Kubernetes
 */
app.get('authentication').secret = process.env.JWT_SECRET || app.get('authentication').secret;
app.configure(authentication(app.get('authentication')));

app.configure(jwt());
const githubSettings = app.get('github');
app.configure(oauth2(Object.assign(githubSettings, {
  name: 'github',
  Strategy: Strategy,
  successRedirect: '/dashboard',
  scope: [],
})));

app.set('view engine', 'pug');
/*
 * Render the dashboard view with authentication
 */
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
      .find({ query: query })
      .then(result =>
        res.render('dashboard', {
          events: result,
          user: (req as any).user,
          query: req.query,
        }));
});
app.get('/logout',
  cookieParser(),
  (req, res, next) => {
    res.clearCookie(app.get('authentication').cookie.name);
    res.redirect('/');
  });


// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

export default app;
