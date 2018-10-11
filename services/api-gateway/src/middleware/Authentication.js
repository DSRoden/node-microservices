const request = require('request-promise');
const CONFIGS = require('../config.json');

module.exports = (req, res, next) => {
  if (CONFIGS.AUTH_SKIP_URL_PARAMS.indexOf(req.params['0']) > -1) {
    return next();
  }

  // begin authenticate
  const authOptions = {
    method: 'POST',
    uri: CONFIGS.AUTH_SERVICE_URL,
    json: req,
    headers: {
      'gateway-auth': 'true',
    },
  };
  return request(authOptions)
    .then((authData) => {
      req.body = authData.body;
      req.query = authData.query;
      if (req.method === 'GET') {
        req.originalUrl = `${req.originalUrl}?user=${req.query.user_id}`;
      }
      return next();
    })
    .catch(() => {
      return res.redirect('http://localhost/error');
    });
};
