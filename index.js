const express = require('express');
const winston = require('winston');
const nconf = require('nconf');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    path: '/socket'
});

app.use((req, res, next) => {
    console.log(req.method, ':' ,req.originalUrl);
    next();
});

require('./startup/startup.logger')();
require('./startup/startup.config')();
require('./startup/startup.db')();
require('./startup/startup.routes')(app);


server.listen(nconf.get('port'), () => {
    winston.info(`Listening on port: ${nconf.get('port')}`);
});

module.exports = server;