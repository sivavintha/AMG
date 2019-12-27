const _ = require("lodash");

module.exports = function (req, res, next) {
  if (_.toUpper(req.body.userRole) !== 'ADMIN') {
    console.log('Access Denied');
    return res.status(403).send('Access denied.');
  }
  next();
};