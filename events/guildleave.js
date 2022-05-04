const Log = require('../database/logSchema')
const logger = require('../modules/nodeLogger.js');
const Server = require('../database/ServerSchema');
const { removeCache } = require('../modules/cache.js');
module.exports = {
    name: 'guildDelete',
    execute(guild) {
        if (!guild.name) return;
        logger.info(`Left guild: ${guild.name} (${guild.id})`);
        Server.deleteOne({
            _id: guild.id
        }).then(() => {
            removeCache('Server', guild.id)
            logger.info('Deleted the server db entry.')
        }).catch((err) => logger.error(err.stack || err))

        Log.deleteOne({
            _id: guild.id
        }).then(() => {
            removeCache('Log', guild.id)
            logger.info('Deleted the log db entry.')
        }).catch((err) => logger.error(err.stack || err))
    }
}