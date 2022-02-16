const pinger = require('../modules/pinger.js')
var cron = require('node-cron')
const guildscan = require('../modules/guildscan.js')
const logger = require('../modules/nodeLogger.js')
const { AutoPoster } = require('topgg-autoposter')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

module.exports = {
  name: 'ready',
  async execute(client) {
    logger.success('The bot is up and running!');
    console.log("Ready!");

    // Update activity every hour so that it doesn't expire
    client.user.setActivity('for mc!help | hosted by snakecraft hosting', { type: 'WATCHING' });
    setInterval(() => {
      client.user.setActivity('for mc!help | hosted by snakecraft hosting', { type: 'WATCHING' });
    }, 3600000)

    // Scan for guilds not in the db, the ones that were added when the bot was offline
    if (process.argv.slice(2) != '--noguildscan') {
      (async () => {
        logger.info('Started guild scan.');
        await guildscan.execute(client);
      })()
    }

    //add slash commands
    const commands = [];
    const commandFiles = fs.readdirSync(__dirname + '/../slashcommands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`${__dirname}/../slashcommands/${file}`);
      commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    try {
      logger.info('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
      logger.success('Successfully reloaded application (/) commands.');
    } catch (error) {
      logger.error(error.stack || error);
    }

    // Post stats to top.gg
    if (process.env.TOPGGAPI) {
      AutoPoster(process.env.TOPGGAPI, client).on('posted', () => {
        logger.info('Posted stats to Top.gg!');
      })
    } else logger.info("No topgg token was provided - stats won't be posted to top.gg!");

    // Call the pinger every 5 minutes
    cron.schedule('*/5 * * * *', () => {
      try {
        pinger.execute(client)
      } catch (err) {
        logger.error('Error while updating channels: ' + err.stack || err)
      } finally {
        logger.info('Done updating channels')
      }
    });
    try {
      pinger.execute(client)
    } catch (err) {
      logger.error('Error while updating channels: ' + err.stack || err)
    } finally {
      logger.info('Done updating channels')
    }
  }
}
