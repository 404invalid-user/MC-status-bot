const logger = require('../modules/nodeLogger.js')
const { lookup } = require('../modules/cache.js')

const channelUpdater = require('../modules/channelupdater.js')
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Check if user is rate limited and stop spam killing redis;
    const limited = client.rateLimiter.take(interaction.member.id)
    if (limited) return // No response is sent if the user is rate limited

    if (!interaction.isCommand()) return
    if (interaction.channel.type == 'GUILD_DM') return
    //get server
    const server = await lookup('Server', interaction.guild.id)
    //update channel status if it has changed

    if (server !== null) {
      channelUpdater(client, server)
    }

    const commandName = interaction.commandName
    if (!client.slashCommands.has(commandName)) return
    const command = client.slashCommands.get(commandName)

    try {
      command.execute(interaction, server, client)
    } catch (error) {
      logger.error(error.stack || error)
      interaction.reply({ content: 'Uh, oh! An error occurred while trying to execute that command! (**X  _  X**)', allowedMentions: { repliedUser: false } })
    }
  }
}
