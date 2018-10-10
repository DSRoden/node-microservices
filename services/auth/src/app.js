const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const Auth = require('./lib/auth');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res) => {
  res.json({
    hello: 'world!',
  });
});

app.post('/api/v1/auth', (req, res) => {
  // confirm the request is from api-gateway
  if (req.headers['gateway-auth'] !== 'true') {
    return res.status(400).end();
  }
  // pass original request to auth
  const originalRequest = req.body;
  return Auth.authenticate(originalRequest)
  .then((result) => {
    res.send(result).end();
  }).catch((err) => {
    res.status(401).json(err).end();
  });
});

app.post('/api/v1/encode', (req, res) => {
  // confirm the request is from users-service
  if (req.headers['users-service'] !== 'true') {
    return res.status(400).end();
  }

  return Auth.encode(req.body.user, (encodedToken) => {
    res.send({ token: encodedToken }).end();
  });
});


module.exports = app;
