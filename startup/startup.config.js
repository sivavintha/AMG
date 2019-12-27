const nconf = require('nconf');

module.exports = async function () {
    if (process.env.NODE_ENV === 'test')
        nconf.argv().env().file({ file: __dirname + '/../config/test-config.json' });
    else
        nconf.argv().env().file({ file: __dirname + '/../config/default-config.json' });
}