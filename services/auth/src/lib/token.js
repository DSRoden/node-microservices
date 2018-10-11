const moment = require('moment');
const jwt = require('jwt-simple');

function encode(user) {
  const playload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user.id,
  };
  return jwt.encode(playload, process.env.TOKEN_SECRET);
}

function decode(token) {
  return new Promise((resolve, reject) => {
    const payload = jwt.decode(token, process.env.TOKEN_SECRET);
    const now = moment().unix();
    // check if the token has expired
    if (now > payload.exp) {
      reject(new Error('Token has expired.'));
    } else {
      resolve(payload);
    }
  })
    .then((payload) => {
      return payload;
    })
    .catch((err) => {
      return err;
    });
}

module.exports = {
  encode,
  decode,
};
