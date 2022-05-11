const conf = require('../config');


module.exports = (t) => {
    if (conf.debug) process.stdout.write(`\x1b[33m[Debug]: ${t}\n`);
}