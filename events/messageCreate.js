const { lookup } = require('../modules/cache.js')
const channelUpdater = require('../modules/channelupdater.js')

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // Check if user is rate limited
    const limited = client.rateLimiter.take(message.author.id)
    if (limited) return

    //get server
    let server = await lookup('server', message.guild.id)
    //add server to db and cache if it doesnt exist
    if (server == null) {
      await require('./guildadd').addGuild(message.guild.id)
      server = await lookup('server', message.guild.id)
    }
    //update channel status if it has changed
    channelUpdater(client, server)
    //update guild name and icon
    if (message.guild.name != server.name || message.guild.iconURL() != server.icon) {
      server.name = message.guild.name
      server.icon = message.guild.iconURL()
      server.save()
    }
    // if the bot is the author
    if (message.author.bot) return
    // if its a dm
    if (message.channel.type == 'GUILD_DM') return
    // if its a reply
    if (message.type === 'REPLY') return
    if (message.content.startsWith('mc!')) {
      message.channel.send(
        'By April 30th bots will be required to use slash commands pleas use slash commands from now on.\nIf you cant see any commands in the menu please kick then add the bot with this link https://discord.com/oauth2/authorize?client_id=816747912888975362&permissions=269798480&scope=bot%20applications.commands'
      )
    }

    const notification = require('../modules/notification')

    if (message.content.startsWith('mc!test')) {
      notification('online', server)
    }
  }
}
