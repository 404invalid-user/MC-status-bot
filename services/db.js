const fs = require('fs');
require('dotenv').config();
const Redis = require('ioredis');
const mongoose = require('mongoose');
const logger = require('../modules/nodeLogger');
const LogSchema = require('../database/logSchema');
const ServerSchema = require('../database/ServerSchema');

module.exports = async() => {
    logger.info('starting db service');
    // Connect to database
    await mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => logger.info('Connected to database!')).catch((err) => logger.error(err.stack || err));
    const redisDetails = process.env.REDIS.split(':');
    const redisclient = new Redis({
        password: redisDetails.length == 3 ? redisDetails[0] : null,
        host: redisDetails.length == 3 ? redisDetails[1] : redisDetails[0],
        port: redisDetails.length == 3 ? redisDetails[2] : redisDetails[1]
    });
    global.redisclient = redisclient;
    // Flush redis db
    await redisclient.flushdb(async(err, succeeded) => {
        logger.info(`Flushing Redis -  ${err ? err : succeeded}`);
        // Cache the entire mongo database to redis.
        // Cache it only after redis gets flushed
        logger.info('Started caching the databases');

        await LogSchema.find().then((result) => {
            result.forEach((log) => redisclient.hset('log', log._id, JSON.stringify(log)));
            logger.info('Cached logs');
        }).catch((err) => logger.error(err.stack || err));

        await ServerSchema.find().then((result) => {
            result.forEach(async(server) => {
                if (!server.checker) {
                    server.checker = {
                        channel: {
                            status: 'offline',
                            members: '0'
                        },
                        notification: {
                            status: 'offline',
                            members: '0'
                        }
                    }

                    await server.save();
                }
                redisclient.hset('server', server._id, JSON.stringify(server));
            });
            logger.info('Cached servers');
        }).catch((err) => logger.error(err.stack || err));

        //get launage files and cache them
        const lanFiles = fs.readdirSync(`${__dirname}/../languages/`).filter((file) => file.endsWith('.json'));
        for await (let fileName of lanFiles) {
            if (fileName !== 'en.json') {
                let file = require(`${__dirname}/../languages/${fileName}`);
                redisclient.hset('lan', file.iso, JSON.stringify(file));
            }
        }
        return true;
    });
    return true;
}