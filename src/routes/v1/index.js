const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const profileRoute = require('./profile.route');
const genreRoute = require('./genre.route');
const formatRoute = require('./format.route');
const authorRoute = require('./author.route');
const imageRoute = require('./image.route');
const comicRoute = require('./comic.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/profile',
    route: profileRoute,
  },
  {
    path: '/genres',
    route: genreRoute,
  },
  {
    path: '/formats',
    route: formatRoute,
  },
  {
    path: '/authors',
    route: authorRoute,
  },
  {
    path: '/images',
    route: imageRoute,
  },
  {
    path: '/comics',
    route: comicRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
