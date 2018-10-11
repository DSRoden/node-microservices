const express = require('express');
// const localAuth = require('../auth/local');
const authHelpers = require('../auth/_helpers');
const CONFIGS = require('../config.json');
const request = require('request-promise');

const router = express.Router();

router.get('/ping', (req, res) => {
  const response = {
    message: 'pong',
    query: req.query,
    body: req.body,
  };
  res.send(response);
});

router.post('/register', (req, res) => {
  return authHelpers.createUser(req, res)
  .then((userRow) => {
    // return localAuth.encodeToken(user[0]);
    const user = userRow[0];
    const options = {
      method: 'POST',
      uri: CONFIGS.AUTH_ENCODE_URL,
      json: { user },
      headers: {
        'users-service': 'true',
        'Content-Type': 'application/json',
      },
    };

    return new Promise((resolve, reject) => {
      request(options)
      .then((response) => {
        const token = response.token;
        const username = user.username;
        resolve({ token, username });
      }).catch((err) => {
        reject(err);
      });
    });
  })
  .then((authResult) => {
    const username = authResult.username;
    const token = authResult.token;
    res.status(200).json({
      status: 'success',
      token,
      username,
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      messsage: err,
    });
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  return authHelpers.getUser(username)
  .then((response) => {
    if (!authHelpers.comparePass(password, response.password)) {
      throw new Error('Incorrect password');
    }
    return response;
  })
  .then((response) => {
    // return localAuth.encodeToken(response);
    const options = {
      method: 'POST',
      uri: CONFIGS.AUTH_ENCODE_URL,
      json: { user: response },
      headers: {
        'users-service': 'true',
        'Content-Type': 'application/json',
      },
    };
    return new Promise((resolve, reject) => {
      request(options)
      .then((authResponse) => {
        const token = authResponse.token;
        resolve({ token, username });
      }).catch((err) => {
        reject(err);
      });
    });
  })
  .then((authData) => {
    const token = authData.token;
    res.status(200).json({
      status: 'success',
      token,
      username,
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      messsage: err,
    });
  });
});

router.get('/user', (req, res) => {
  if (!req.query.user) {
    return res.status(400).json({
      status: 'Please log in',
    }).end();
  }
  return res.status(200).json({
    status: 'success',
    user: req.query.user,
  });
});

module.exports = router;
