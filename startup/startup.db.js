const winston = require('winston');
const mongoose = require('mongoose');
const nconf = require('nconf');

module.exports = function () {

    const db = nconf.get('db');
    console.log(db);

    // mongoose.connect(db, { useNewUrlParser: true })
    mongoose.connect(db, { useNewUrlParser: true, replicaSet: 'rs0' })
        .then(() => {
            winston.info(`Connected to ${db}...`);
        });
}