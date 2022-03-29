const logger = require('../modules/nodeLogger.js')
const { lookup } = require('../modules/cache.js')
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const limited = client.rateLimiter.take(interaction.member.id)
    if (limited) return
    if (!interaction.isCommand()) return
    if (interaction.channel.type == 'GUILD_DM') return
    //get server
    const server = await lookup('Server', interaction.guild.id)
    if (server == null) return
    if (!client.slashCommands.has(interaction.commandName)) return
    const command = client.slashCommands.get(interaction.commandName)
    try {
      return command.execute(interaction, server, client)
    } catch (error) {
      logger.error(error.stack || error)
      return interaction.reply({ content: 'Uh, oh! An error occurred while trying to execute that command! (**X  _  X**)', allowedMentions: { repliedUser: false } })
    }
  }
}
