const express = require('express');
const adminUsers = require('../routes/admin/routes.adminUsers');
const userRoles = require('../routes/admin/routes.userRoles');
const goldPrice = require('../routes/admin/routes.goldPrice');
const error = require('../middleware/middleware.error');
const cors = require('cors');


const corsOptions = function (req, callback) {
  var corsOptions = {
    origin: "*",
    exposedHeaders: 'x-auth-token',
  };
  callback(null, corsOptions);
}

module.exports = function(app) {
  app.use(express.json({limit: '50mb'}));
  app.use(cors(corsOptions));
  app.use(express.static(__dirname));  
  app.use('/api/adminusers', adminUsers);  
  app.use('/api/userroles', userRoles);
  app.use('/api/goldprice', goldPrice);
  app.use(error);
}