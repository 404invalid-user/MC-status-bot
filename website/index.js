const express = require('express');
const rateLimit = require('express-rate-limit');
const analytics = require('../modules/webanalytics');

module.exports = (webServer, shards) => {
    const cache = require('../modules/cache');
    webServer.use(express.json());
    webServer.use(express.urlencoded({ extended: true }));
    webServer.use(express.static(__dirname + '/dist'));
    webServer.use(analytics());
    webServer.use((req, res, next) => {
        const { headers: { cookie } } = req;
        if (cookie) {
            const values = cookie.split(';').reduce((res, item) => {
                const data = item.trim().split('=');
                return { ...res, [data[0]]: data[1] };
            }, {});
            req.cookies = values;
        } else req.cookies = {};
        next();
    })

    webServer.use(async (req, res, next) => {
        req.user = null;
        if (!req.cookies.id || !req.cookies.token) return next();
        const currentUser = await cache.lookup('user', req.cookies.id).catch((e) => { });
        if (currentUser == null) return next();
        const currentTokens = currentUser.accessCodes.filter((ac) => ac.code == req.cookies.token);
        if (currentTokens.length <= 0) return next();
        req.user = await currentUser;
        return next();
    })
    //rate limit the api so we dont have spam
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 400
    });

    webServer.use('/api/', apiLimiter);
    ['get', 'post'].forEach((handler) => {
        require(`./handlers/${handler}`)(webServer, shards)
    });
}
