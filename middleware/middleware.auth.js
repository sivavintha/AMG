const jwt = require('jsonwebtoken');
const nconf = require('nconf');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    console.log(`Token not provided`);
    return res.status(401).send('Access denied. No token provided.');
  }
  try {
    const decoded = jwt.verify(token, nconf.get('privateKey'));
    req.user = decoded;
    next();
  }
  catch (ex) {
    console.log(`Token verification failed`);
    return res.status(400).send('Invalid token.');
  }
}