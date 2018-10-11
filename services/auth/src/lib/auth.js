const TOKEN = require('./token');

function Auth() {}

Auth.authenticate = (req) => {
  return new Promise((resolve, reject) => {
    if (!req.headers.authorization) {
      return reject(new Error('Invalid authorization'));
    }

    const header = req.headers.authorization.split(' ');
    const token = header[1];

    return TOKEN.decode(token).then((payload) => {
      if (!payload.sub) {
        return reject(new Error('Invalid authorization'));
      }
      const userId = payload.sub;
      const authData = {};
      authData.body = (req.body) ? req.body : {};
      authData.body.user_id = userId;
      authData.query = (req.query) ? req.query : {};
      authData.query.user_id = userId;
      return resolve(authData);
    });
  });
};


Auth.encode = (user, cb) => {
  const encodedToken = TOKEN.encode(user);
  cb(encodedToken);
};


module.exports = Auth;
