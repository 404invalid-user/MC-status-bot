const Server = require('../database/ServerSchema')
const Log = require('../database/logSchema')
const { Permissions } = require('discord.js')
require('../modules/cache.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const translate = require('../modules/translate')
const cache = require('../modules/cache.js')

module.exports = {
  name: 'log',
  data: new SlashCommandBuilder()
    .setName('log')
    .setDescription('turn logging on or off')
    .addStringOption((option) => option.setName('value').setDescription('logging option').setRequired(true).addChoice('on', 'on').addChoice('off', 'off')),
  async execute(interaction, server) {
    let replyContent = ''
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
      server.Logging = true
    } else if (args == 'off') {
      server.Logging = false
    }

    server.save()

    if (server.logging == true) {
      const logs = await cache.lookup('Log', interaction.guild.id)
      if (logs !== null) {
        logs.logs = [];
        logs.save();
      }
      replyContent = `${await translate(server.lan, 'Logging has been turned')} ${await translate(server.lan, 'on')}`
      interaction.reply(replyContent)
    } else if (server.logging == false) {
      Log.findOneAndRemove(
        {
          _id: interaction.guild.id
        },
        {
          useFindAndModify: false,
          new: true
        }
      )
        .cache()
        .catch((err) => console.error(err))
        .then(async (e) => {
          replyContent = `${await translate(server.lan, 'Logging has been turned')} ${await translate(server.lan, 'off')}`
          interaction.reply(replyContent)
        })
    }
  }
}
