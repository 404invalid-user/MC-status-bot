const { lookup } = require('../modules/cache.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const translate = require('../modules/translate')
module.exports = {
  name: 'ip',
  data: new SlashCommandBuilder().setName('ip').setDescription('return the default ip of the server'),
  async execute(interaction, server) {
    // Fetch data from db
    // By using redis caching this function's execution time dropped from a average of 29ms to less then one
    const data = await lookup('Server', interaction.guild.id);
    let replyContent = ''
    if (!data.IP) {
      replyContent = await translate(server.lan, 'This server doest have a default ip set! A admin can do that by using the `/setip` command.')
    } else {
      if (data.Bedrock == true)
        replyContent = `${await translate(server.lan, "This server's default ip is")} \`${data.IP}\`. ${await translate(server.lan, 'This is a bedrock server.')}`
      else replyContent = `${await translate(server.lan, "This server's default ip is")} \`${data.IP}\`. ${await translate(server.lan, 'This is a java server.')}`
    }
    interaction.reply(replyContent)
  }
}
