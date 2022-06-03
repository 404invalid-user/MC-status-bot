const Server = require('../database/ServerSchema')
const { Permissions } = require('discord.js')
const { lookup } = require('../modules/cache.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const translate = require('../modules/translate')
module.exports = {
  name: 'rmchann',
  data: new SlashCommandBuilder().setName('rmchann').setDescription('remove the monitoring channels'),
  async execute(interaction, server) {
    let replyContent = ''
    // Check if the person is admin
    if (!interaction.member.permissions.has('MANAGE_GUILD') && interaction.member.id != process.env.OWNERID) {
      replyContent = await translate(server.lan, 'You need the `MANAGE_GUILD` permission to use this command!')
      return interaction.reply(replyContent)
    }

    // Get the db entry for
    const result = await lookup('server', interaction.guild.id)

    // server didn't define a ip or id of all the channels
    if (!result.StatusChannId || !result.NumberChannId || !result.CategoryId) {
      return interaction.reply(`${await translate(server.lan, 'This server doest have the monitoring channels set up. use `/setup` to do so.')}`)
    }

    // Remove the channels
    try {
      await interaction.guild.channels.cache.get(result.StatusChannId).delete()
      await interaction.guild.channels.cache.get(result.NumberChannId).delete()
      await interaction.guild.channels.cache.get(result.CategoryId).delete()
    } catch (err) {
      if (!err == "TypeError: Cannot read properties of undefined (reading 'delete')") console.error(err)
    }

    // Remove from db
    server.StatusChannId = ''
    server.NumberChannId = ''
    server.CategoryId = ''
    server.save()
    message.reply(`${await translate(server.lan, 'The channels have been removed!')}`)
  }
}
