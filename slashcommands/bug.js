const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const translate = require('../modules/translate')

module.exports = {
  name: 'bug',
  data: new SlashCommandBuilder()
    .setName('bug')
    .setDescription('Report a bug in the bot.')
    .addStringOption((option) => option.setName('description').setDescription('description of the bug to report').setRequired(true)),
  execute(interaction, server, client) {
    const owner = client.users.cache.get(process.env.OWNERID)
    let bug = interaction.options.getString('description')

    const embed = new Discord.MessageEmbed()
      .setTitle('New Bug report!')
      .addField('Author', interaction.member.user.toString(), true)
      .addField('Guild', `name: ${interaction.guild.name}\nid: ${interaction.guild.id}`, true)
      .addField('Report', bug)
      .setThumbnail(interaction.member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
    owner.send({ embeds: [embed] })

    interaction.reply(translate(server.lan, 'To report a bug please go to our website at https://www.mcstatusbot.site/bug'))
  }
}
