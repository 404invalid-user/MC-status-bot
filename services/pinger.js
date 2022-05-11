const cron = require('node-cron');
const config = require('../config');
const logger = require('../modules/nodeLogger');

module.exports = () => {
    if (!config.pinger.enabled) return
    logger.info('starting pinger service')
    const pinger = require('../modules/pinger.js')
        // Call the pinger every x minutes
    cron.schedule(`*/${config.pinger.interval && parseInt(config.pinger.interval) > 1 && parseInt(config.pinger.interval) < 60 ? config.pinger.interval : '5'} * * * *`, () => {
        try {
            pinger()
        } catch (err) {
            logger.error('Error while updating channels: ' + err.stack || err)
        } finally {
            logger.info('Done updating channels')
        }
    })
    if (!config.pinger.runAtStart) return;
    try {
        pinger()
    } catch (err) {
        logger.error('Error while updating channels: ' + err.stack || err)
    } finally {
        logger.info('Done updating channels')
    }
    return;
}