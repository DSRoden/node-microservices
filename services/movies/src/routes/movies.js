const express = require('express');

const queries = require('../db/queries.js');
// const routeHelpers = require('./_helpers');

const router = express.Router();

router.get('/ping', (req, res) => {
  const response = {
    message: 'pong',
    query: req.query,
    body: req.body,
  };
  res.send(response);
});

/*
get movies by user
 */
/* eslint-disable no-param-reassign */
router.get('/user', (req, res, next) => {
  return queries.getSavedMovies(parseInt(req.query.user, 10))
  .then((movies) => {
    res.json({
      status: 'success',
      data: movies,
    });
  })
  .catch((err) => { return next(err); });
});
/* eslint-enable no-param-reassign */

/*
add new movie
 */
router.post('/', (req, res, next) => {
  return queries.addMovie(req.body)
  .then(() => {
    res.json({
      status: 'success',
      data: 'Movie Added!',
    });
  })
  .catch((err) => { return next(err); });
});

module.exports = router;
