const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const logger = require('../modules/nodeLogger.js')

const setBotInfo = require('../modules/nodeLogger')
module.exports = {
  name: 'ready',
  async execute(client) {
    console.log("Ready!");
    logger.success('The bot is up and running!')
    // Update activity every hour so that it doesn't expire
    client.user.setActivity('for /help | hosted by http://schost.us', { type: 'WATCHING' })
    setInterval(() => {
      client.user.setActivity('for /help | hosted by http://schost.us', { type: 'WATCHING' })
    }, 3600000)
    //add slash commands
    const commands = []
    const commandFiles = fs.readdirSync(__dirname + '/../slashcommands').filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = require(`${__dirname}/../slashcommands/${file}`)
      commands.push(command.data.toJSON())
    }
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)
    try {
      logger.info('Started refreshing application (/) commands.')
      await rest.put(Routes.applicationCommands(client.user.id), { body: commands })
      logger.success('Successfully reloaded application (/) commands.')
    } catch (error) {
      logger.error(error.stack || error)
    }
  }
}
