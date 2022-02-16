const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');
const sanitize = require('mongo-sanitize');
const { Permissions } = require('discord.js');
require('../modules/cache.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'setip',
    data: new SlashCommandBuilder()
        .setName('setip')
        .setDescription('set an ip that the bot will monitor')
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('the server ip')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The server type')
                .setRequired(false)
                .addChoice('java', 'java')
                .addChoice('bedrock', 'bedrock')
        ),
    execute(interaction, server) {
        // Check if the person is admin
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && interaction.member.id !== process.env.OWNERID) {
            return interaction.reply('You have to be a admin to use this command!');
        }
        if (!interaction.options.getString('ip')) {
            return interaction.reply('Please specify a valid IP!');
        }

        var ip = interaction.options.getString('ip').toString().toLowerCase();
        const bedrock = interaction.options.getString('type') == 'bedrock' || interaction.options.getString('type') == 'b' ? true : false;

        server.IP = ip;
        server.bedrock = bedrock;
        server.save();
        // Remove all logs
        Log.findByIdAndUpdate({ _id: interaction.guild.id }, { $set: { logs: [] } }, { useFindAndModify: false, new: true }).cache().catch((err) => console.error(err));
        return interaction.reply('The main IP has been set to: `' + ip + '`');
    }
}