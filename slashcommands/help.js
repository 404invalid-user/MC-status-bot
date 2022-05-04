const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const translate = require('../modules/translate')
module.exports = {
  name: 'botstats',
  data: new SlashCommandBuilder().setName('botstats').setDescription('get info on the bot'),
  async execute(interaction, server) {
    const description = `${await translate(
      server.lan,
      'Please report any bugs that you encounter on [Github](https://github.com/404invalid-user/MC-status-bot/issues) or [the website](https://www.mcstatusbot.site/bug)!'
    )}
**Admin commands:**
\`/log [on/off]\` - ${await translate(server.lan, 'turn logging on or off.')}
\`/setup [ip] [bedrock]\` - ${await translate(server.lan, 'set up the channels that will display the status of a selected server.')}
\`/rmchann\` - ${await translate(server.lan, 'remove the monitoring channels.')}
**${await translate(server.lan, 'User Commands')}:**
\`/ip\` - ${await translate(server.lan, 'return the default ip of the server.')}
\`/ping\` - ${await translate(server.lan, 'ping a minecraft server.')}
\`/news\` - ${await translate(server.lan, 'see the latest articles from minecraft.net.')}
\`/chart \` - ${await translate(server.lan, 'make a chart with the logged info.')}
\`/bug\` - ${await translate(server.lan, 'Report a bug in the bot.')}

[${translate(server.lan, 'Snakecraft Hosting ')}](https://discord.gg/YzX5KdF4kq) | [${await translate(server.lan, 'Dashboard')}](https://www.mcstatusbot.site/dashboard) | [${translate(
      server.lan,
      'Invite Bot'
    )}](https://discord.com/oauth2/authorize?client_id=816747912888975362&scope=bot&permissions=268749904) | [${translate(
      server.lan,
      'Privacy Policy'
    )}](https://github.com/404invalid-user/MC-status-bot/blob/main/miscellaneous/Privacy_policy.md) | [${translate(
      server.lan,
      'Github'
    )}](https://github.com/404invalid-user/MC-status-bot) | [${translate(server.lan, 'Support Server')}](https://discord.gg/YzX5KdF4kq)`

    const embed = new Discord.MessageEmbed()
      .setColor('#008000')
      .setTitle(`<a:cube:892129423141269535>  ${await translate(server.lan, 'About the bot')}`)
      .setDescription(description)
    interaction.reply({ embeds: [embed] })
  }
}
