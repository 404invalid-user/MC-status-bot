const { ShardingManager } = require('discord.js')
const mongoose = require('mongoose')
const express = require('express')
const { AutoPoster } = require('topgg-autoposter')
require('dotenv').config()
const LogSchema = require('./database/logSchema')
const ServerSchema = require('./database/ServerSchema')
const Redis = require('ioredis')
const logger = require('./modules/nodeLogger.js')
const webserver = express()
const fs = require('fs')
webserver.use((req, res, next) => {
  req.date = Date.now()
  next()
})
process.on('uncaughtException', async (error, source) => {
  await logger.crash(error.stack || error + 'at' + source)
  //process.exit(1)
})
const webServerSetup = require('./website/index')

const shards = new ShardingManager('./bot.js', {
  token: process.env.TOKEN,
  totalShards: 'auto'
})

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

global.redisclient = redisclient

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
      result.forEach(async (server) => {
          server.config = {
            enabled: false,
            notifications: {
              webhook: {
                enabled: false,
                url: '',
                content: '[ip] is [status]',
              },
              bot: {
                enabled: false,
                content: '[ip] is [status]',
                channel: '',
              },
              email: {
                enabled: false,
                to: 'no-one@mcstatusbot.site',
                subject: '[ip] is [status]',
                content: '[ip] is [status]',
              },
            },
            chart: {
              enabled: true,
              embed: {
                uptime: {
                  title: "[ip]'s uptime",
                  description: "[ip] was up for [uptime] minutes and down for [downtime] minutes. This means that [ip] has a uptime percentage of [onlinepercent] and downtime percentage of [offlinepercent]",
                  color: "#FFFFF"
                },
                playersonline: {
                  title: "Number of players online on [ip]",
                  description: "There have been a maximum of [maxplayers] players online at once, and a minimum of [minplayers].",
                  color: "#FFFFF"
                },
                mostactive: {
                  title: "Most active players on [ip] in the last 24 hours",
                  description: "[mostactive] was the most active player with [mostactiveminutes] minutes spent online in the last 24 hours.",
                  color: "#FFFFF"
                }
              },
              graph: {
                text: {
                  title: '253, 253, 253',
                  time: '253, 253, 253',
                  state: '253, 253, 253'
                },
                line: {
                  fill: '8, 174, 228',
                  border: '39, 76, 113'
                }
              }
            }
          }
          await server.save();
          console.log("SAVED")
      
        redisclient.hset('Server', server._id, JSON.stringify(server))
      })
      logger.info('Cached servers')
    })
    .catch((err) => logger.error(err.stack || err))

  const lanFiles = fs.readdirSync(`${__dirname}/languages/`).filter((file) => file.endsWith('.json'))
  for (let fileName of lanFiles) {
    let file = require(`${__dirname}/languages/${fileName}`)
    redisclient.hset('lan', file.iso, JSON.stringify(file))
  }
})

shards.on('shardCreate', (shard) => {
  logger.info(`Launched shard #${shard.id}`)
})

// Post stats to top.gg
if (process.env.TOPGGAPI) {
  AutoPoster(process.env.TOPGGAPI, shards).on('posted', () => {
    logger.info('Posted stats to Top.gg!')
  })
} else logger.info("No topgg token was provided - stats won't be posted to top.gg!")

shards.spawn(shards.totalShards, 10000)

webServerSetup(webserver, redisclient, shards)

webserver.listen(process.env.PORT, () => {
  logger.success('web server listening on port ' + process.env.PORT)
})
