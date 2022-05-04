const Log = require('../database/logSchema')
const { SlashCommandBuilder } = require('@discordjs/builders')
const translate = require('../modules/translate')
const cache = require('../modules/cache.js')
const LogSchema = require('../database/logSchema')
module.exports = {
  name: 'log',
  data: new SlashCommandBuilder()
    .setName('log')
    .setDescription('turn logging on or off')
    .addStringOption((option) => option.setName('value').setDescription('logging option').setRequired(true).addChoice('on', 'on').addChoice('off', 'off')),
  async execute(interaction, server, user) {
    let replyContent = 'error'
    // Check if the person is admin
    if (!interaction.member.permissions.has('MANAGE_GUILD') && interaction.member.id != process.env.OWNERID) {
      replyContent = await translate(server.lan, 'You need the `MANAGE_GUILD` permission to use this command!')
      return interaction.reply(replyContent)
    }
    args = interaction.options.getString('value')
    if (!server.IP || server.IP == '' || server.IP == ' ') {
      replyContent = await translate(server.lan, 'there is no ip set use `/setup` to set an ip')
      return interaction.reply(replyContent)
    }

    if (args == 'on') {
      replyContent = `${await translate(server.lan, 'Logging has been turned')} ${await translate(server.lan, 'on')}`
      let logs = await cache.lookup('Log', interaction.guild.id)
      server.Logging = true
      if (logs == null) {
        await LogSchema.create({ _id: server._id })
        logs = await cache.lookup('Log', interaction.guild.id)
      }
      logs.logs = []
      logs.save()
    } else if (args == 'off') {
      replyContent = `${await translate(server.lan, 'Logging has been turned')} ${await translate(server.lan, 'off')}`
      server.Logging = false
      await cache.removeCache('Log', server._id)
      Log.deleteOne({ _id: interaction.guild.id }).catch((err) => logger.error(err))
    }
    server.save()
    return interaction.reply(replyContent)
  }
}
