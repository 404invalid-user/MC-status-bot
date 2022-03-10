const { ShardingManager } = require("discord.js");
const mongoose = require('mongoose');
const express = require('express')
const { AutoPoster } = require('topgg-autoposter')
require('dotenv').config();
const LogSchema = require('./database/logSchema');
const ServerSchema = require('./database/ServerSchema');
const Redis = require('ioredis');
const logger = require('./modules/nodeLogger.js');
const webserver = express();
const fs = require('fs')
webserver.use((req, res, next) => {
  req.date = Date.now();
  next();
});
process.on('uncaughtException', async (error, source) => {
  await logger.crash(error.stack || error + 'at' + source);
  //process.exit(1)
})
const webServerSetup = require('./website/index');

const shards = new ShardingManager("./bot.js", {
  token: process.env.TOKEN,
  totalShards: "auto"
});

// Connect to database
mongoose
  .connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to database!'))
  .catch((err) => logger.error(err.stack || err))

const redisDetails = process.env.REDIS.split(':')
const redisclient = new Redis({
  password: redisDetails.length == 3 ? redisDetails[0] : null,
  host: redisDetails.length == 3 ? redisDetails[1] : redisDetails[0],
  port: redisDetails.length == 3 ? redisDetails[2] : redisDetails[1]
})

global.redisclient = redisclient;

// Flush redis
redisclient.flushall(async (err, succeeded) => {
  logger.info(`Flushing Redis -  ${err ? err : succeeded}`)

  // Cache the entire mongo database to redis.
  // Cache it only after redis gets flushed
  logger.info('Started caching the databases')

  await LogSchema.find()
    .then((result) => {
      result.forEach((log) => redisclient.hset('Log', log._id, JSON.stringify(log.logs)))
      logger.info('Cached logs')
    })
    .catch((err) => logger.error(err.stack || err))

  await ServerSchema.find()
    .then((result) => {
      result.forEach((server) => {
        redisclient.hset('Server', server._id, JSON.stringify(server))
      })
      logger.info('Cached servers')
    }).catch((err) => logger.error(err.stack || err));



  const lanFiles = fs.readdirSync(`${__dirname}/languages/`).filter((file) => file.endsWith(".json"));
  for (let fileName of lanFiles) {
    let file = require(`${__dirname}/languages/${fileName}`);
    redisclient.hset('lan', file.iso, JSON.stringify(file));
  }

});


shards.on("shardCreate", shard => {
  logger.info(`Launched shard #${shard.id}`);
});

// Post stats to top.gg
if (process.env.TOPGGAPI) {
  AutoPoster(process.env.TOPGGAPI, shards).on('posted', () => {
    logger.info('Posted stats to Top.gg!')
  });
} else logger.info("No topgg token was provided - stats won't be posted to top.gg!")

shards.spawn(shards.totalShards, 10000);

webServerSetup(webserver, redisclient, shards);

webserver.listen(process.env.PORT, () => {
  logger.success("web server listening on port " + process.env.PORT);
})