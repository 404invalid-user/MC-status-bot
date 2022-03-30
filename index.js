const db = require('./services/db')
const topgg = require('./services/top.gg')
const pinger = require('./services/pinger')
const webserver = require('./services/webserver')
const { ShardingManager } = require('discord.js')

process.on('uncaughtException', async (error, source) => {
  require('./modules/nodeLogger').crash(error.stack || error + 'at' + source)
})

const main = async () => {
  const shards = new ShardingManager('./bot.js', {
    token: process.env.TOKEN,
    totalShards: 'auto'
  })
  //connect to db and cache
  await db()
  //setup bot and shards
  await shards.on('shardCreate', (shard) => {
    logger.info(`Launched shard #${shard.id}`)
  })
  await shards.spawn(shards.totalShards, 500)
  await topgg(shards)
  await pinger(shards)
  await webserver(shards)
  console.log('Ready!')
}
main()
