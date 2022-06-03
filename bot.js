require('dotenv').config()
const fs = require('fs')
const Redis = require('ioredis')
const mongoose = require('mongoose')
const discordModals = require('discord-modals')
const logger = require('./modules/nodeLogger.js')
const { RateLimiter } = require('discord.js-rate-limiter')
const { Client, Intents, Collection } = require('discord.js')

// Handle and log and crashes
process.on('uncaughtException', async (error, source) => {
  await logger.crash(error.stack || error + 'at' + source)
  //process.exit(1)
})

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
client.rateLimiter = new RateLimiter(1, 2000) // Rate limit to one message every two seconds;
client.commands = new Collection()
client.slashCommands = new Collection()
discordModals(client) // discord-modals needs your client in order to interact with modals

logger.success('Starting the bot!')

// Connect to database
mongoose
  .connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.info('Connected to database!')
    client.login(process.env.TOKEN)
  })
  .catch((err) => logger.error(err.stack || err))

const redisDetails = process.env.REDIS.split(':')
const redisclient = new Redis({
  password: redisDetails.length == 3 ? redisDetails[0] : null,
  host: redisDetails.length == 3 ? redisDetails[1] : redisDetails[0],
  port: redisDetails.length == 3 ? redisDetails[2] : redisDetails[1]
})

require('./services/thirdparty')()

// Make the redis client global
global.redisclient = redisclient
// slash Command handling
const slashCommandFiles = fs.readdirSync('./slashcommands').filter((file) => file.endsWith('.js'))
for (const file of slashCommandFiles) {
  const command = require(`./slashcommands/${file}`)
  client.slashCommands.set(command.name, command)
}

// Event handling
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))
for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client))
  } else {
    client.on(event.name, (...args) => event.execute(...args, client))
  }
}
