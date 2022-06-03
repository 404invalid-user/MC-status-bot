const express = require('express');
const config = require('../config');
const logger = require('../modules/nodeLogger');
module.exports = (shards) => {
    if (!config.webserver.enabled) return;
    logger.info('starting webserver service');
    const webserver = express();
    webServer.use(express.json());
    webServer.use(express.urlencoded({ extended: true }));
    webServer.use(express.static(__dirname + '/dist'));
    webServer.use(analytics());
    webServer.use((req, res, next) => {
        const { headers: { cookie } } = req;
        if (cookie) {
            const values = cookie.split(';').reduce((res, item) => {
                const data = item.trim().split('=');
                return {...res, [data[0]]: data[1] };
            }, {})
            req.cookies = values;
        } else req.cookies = {}
        next();
    });
    webserver.use((req, res, next) => {
        req.date = Date.now();
        next();
    });
    require('../website/index')(webserver, shards);
    const port = config.webserver.port ? config.webserver.port : 5000;
    webserver.listen(port, () => {
        logger.success('web server listening on port ' + port);
    });
}