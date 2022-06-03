const fs = require('fs')
require('dotenv').config()
const Redis = require('ioredis')
const mongoose = require('mongoose')
const logger = require('../modules/nodeLogger')
const LogSchema = require('../database/logSchema')
const ServerSchema = require('../database/ServerSchema')
module.exports = async () => {
  logger.info('starting db service')
  // Connect to database
  await mongoose
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
  // Flush redis db
  await redisclient.flushdb(async (err, succeeded) => {
    logger.info(`Flushing Redis -  ${err ? err : succeeded}`)
    // Cache the entire mongo database to redis.
    // Cache it only after redis gets flushed
    logger.info('Started caching the databases')

    await LogSchema.find()
      .then((result) => {
        result.forEach((log) => redisclient.hset('log', log._id, JSON.stringify(log)))
        logger.info('Cached logs')
      })
      .catch((err) => logger.error(err.stack || err))

    await ServerSchema.find()
      .then((result) => {
        result.forEach(async (server) => {
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
          }
          if (!server.config) {
            server.config = {
              notifications: {
                webhook: {
                  enabled: false,
                  url: 'http://nice.webhook.mcstatusbot.site/',
                  content: '[ip] is [status]',
                  for: { online: false, offline: false }
                },
                email: {
                  enabled: false,
                  emails: ['no-one@mcstatusbot.site'],
                  subject: '[ip] is [status]',
                  content: 'hello, this is an automated email saying [ip] is [status]',
                  for: { online: false, offline: false }
                }
              },
              chart: {
                enabled: true,
                embed: {
                  uptime: {
                    title: "[ip]'s uptime",
                    description:
                      '[ip] was up for [uptime] minutes and down for [downtime] minutes. This means that [ip] has a uptime percentage of [onlinepercent] and downtime percentage of [offlinepercent]',
                    color: '#FFFFF'
                  },
                  playersonline: {
                    title: 'Number of players online on [ip]',
                    description: 'There have been a maximum of [maxplayers] players online at once, and a minimum of [minplayers].',
                    color: '#FFFFF'
                  },
                  mostactive: {
                    title: 'Most active players on [ip] in the last 24 hours',
                    description: '[mostactive] was the most active player with [mostactiveminutes] minutes spent online in the last 24 hours.',
                    color: '#FFFFF'
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
          }
          await server.save()
          redisclient.hset('server', server._id, JSON.stringify(server))
        })
        logger.info('Cached servers')
      })
      .catch((err) => logger.error(err.stack || err))

    //get launage files and cache them
    const lanFiles = fs.readdirSync(`${__dirname}/../languages/`).filter((file) => file.endsWith('.json'))
    for await (let fileName of lanFiles) {
      if (fileName !== 'en.json') {
        let file = require(`${__dirname}/../languages/${fileName}`)
        redisclient.hset('lan', file.iso, JSON.stringify(file))
      }
    }
    return true
  })
  return true
}
