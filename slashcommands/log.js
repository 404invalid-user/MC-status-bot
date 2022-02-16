const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');
const { Permissions } = require('discord.js');
require('../modules/cache.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('chart.js');



module.exports = {
  name: 'log',
  data: new SlashCommandBuilder()
    .setName('log')
    .setDescription('turn logging on or off')
    .addStringOption(option =>
      option.setName('value')
        .setDescription('logging option')
        .setRequired(true)
        .addChoice('on', 'on')
        .addChoice('off', 'off')),
  execute(message, server) {
    // Check if the person is admin
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      message.reply('You have to be a admin to use this command!');
      return;
    }
      args = message.options.getString('value');
      if (!server.IP || server.IP == '' || server.IP == ' ') {
        return message.reply("there is no ip set use `/setup` to set an ip");
      }

    if (args == 'on') var logging = true;
    else if (args == 'off') var logging = false;
    else {
      return message.reply('Please specify a valid option (on/off)');
    }
    server.Logging = logging;
    server.save();

    if (logging == true) {
      // Create a log document
      Log.findByIdAndUpdate({
        _id: message.guild.id
      }, {
        "logs": []
      }, {
        useFindAndModify: false,
        new: true,
        upsert: true
      }).cache()
        .catch((err) => {
          // This code means that the document already exists. We can just ignore this since no new document is created
          if (!err.code == 11000) {
            console.error(err);
          }
        })
        .then(message.reply(`Logging has been turned on`))
    } else if (logging == false) {
      Log.findOneAndRemove({
        _id: message.guild.id
      }, {
        useFindAndModify: false,
        new: true
      }).cache()
        .catch((err) => console.error(err))
        .then(message.reply(`Logging has been turned off`))
    }
  }
}