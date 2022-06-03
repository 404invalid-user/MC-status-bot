require('dotenv').config();
const logger = require('../modules/nodeLogger.js');
const { AutoPoster } = require('topgg-autoposter');
module.exports = (shards) => {
    if (process.env.TOPGGAPI) {
        AutoPoster(process.env.TOPGGAPI, shards).on('posted', () => {
            info('Posted stats to Top.gg!');
        });
    } else {
        logger.info("No topgg token was provided - stats won't be posted to top.gg!");
    }
}