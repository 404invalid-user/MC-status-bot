const logger = require('../modules/nodeLogger.js')
const { lookup } = require('../modules/cache.js')
const channelUpdater = require('../modules/channelupdater.js')

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // Check if user is rate limited
    const limited = client.rateLimiter.take(message.author.id)
    if (limited) return

    //get server
    const server = await lookup('Server', message.guild.id)
    if (server !== null) {
      //update channel status if it has changed
      channelUpdater(client, server)
      //update guild name and icon
      server.name = message.guild.name
      server.icon = message.guild.iconURL()
      server.save()
    } else {
      //add server to db if it doesnt exist
      await require('./guildadd').addGuild(message.guild.id)
    }

    // check if the command exist
    const args = message.content.slice(3).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    // Ignore messages:
    // if the message starts with the prefix
    if (!message.content.startsWith('mc!')) return

    if (message.content.startsWith('mc!map')) {
      require('../testing')(message, args)
    }

    // if the bot is the author
    if (message.author.bot) return
    // if its a dm
    if (message.channel.type == 'GUILD_DM') return
    // if its a reply
    if (message.type === 'REPLY') return

    if (!client.commands.has(commandName)) return
    const command = client.commands.get(commandName)
    try {
      message.channel.send(
        'By April 30th bots will be required to use slash commands pleas do `/' +
          commandName +
          '` from now on.\nIf you cant see any commands in the menu please kick then add the bot with this link https://discord.com/oauth2/authorize?client_id=816747912888975362&permissions=269798480&scope=bot%20applications.commands'
      )
      command.execute(message, args, server, client)
    } catch (error) {
      logger.error(error.stack || error)
      message.reply({
        content: 'Uh, oh! An error occurred while trying to execute that command! (**X  _  X**)',
        allowedMentions: { repliedUser: false }
      })
    }
  }
}
