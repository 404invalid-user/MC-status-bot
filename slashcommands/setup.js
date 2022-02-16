const { Permissions } = require('discord.js');
const setip = require('../slashcommands/setip.js');
const util = require('minecraft-server-util');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  name: 'setup',
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('set up the channels that will display the status of a selected server')
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
    )
    .addStringOption(option =>
      option.setName('show-members')
        .setDescription('show members in channel status')
        .setRequired(false)
        .addChoice('no', 'no')
        .addChoice('yes', 'yes')
    ),
  async execute(interaction, server, client) {
    // Check if the person is admin
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && interaction.member.id !== process.env.OWNERID) return interaction.reply('You have to be a admin to use this command!');


    try {
      setip.execute(interaction, server, client);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Uh, oh! An error occurred while trying to set the ip! (**X  _  X**)', allowedMentions: { repliedUser: false } });
    }
    const showMembers = interaction.options.getString('show-members');
    if (showMembers == 'yes') {
      server.MemberChannEnabled = true;
    } else {
      server.MemberChannEnabled = false;
    }

    // Check if bot has all the permissions
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES) && !interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      return interaction.reply("I don't have the necessary permissions to perform this action! - `Manage roles` and `Manage channels`");
    } else if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      return interaction.reply("I don't have the necessary permissions to perform this action! - `Manage channels`");
    } else if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      return interaction.reply("I don't have the necessary permissions to perform this action! - `Manage roles`");
    }

    async function servonline(result) {
      // server is online
      await client.channels.cache.get(StatusChan.id).setName('🟢 ONLINE');
      const chann = client.channels.cache.get(NumberChan.id);
      await chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
        VIEW_CHANNEL: true
      });
      if (server.MemberChannEnabled) {
        await chann.setName(`👥 Players online: ${result.players.online}`);
      } else {
        await client.channels.cache.get(NumberChan.id).setName(`👥 Players online: disabled`)
      }
      server.pinger = {
        status: 'online',
        members: result.players.online
      }
    }
    async function servoffline() {
      await client.channels.cache.get(StatusChan.id).setName('🔴 OFFLINE');
      if (server.MemberChannEnabled) {
        await client.channels.cache.get(NumberChan.id).setName(`👥 Players online: 0`)
      } else {
        await client.channels.cache.get(NumberChan.id).setName(`👥 Players online: disabled`)
      }
      server.pinger = {
        status: 'offline',
        members: '0'
      }
    }


    // Get the ip of the server
    const ip = server.IP.split(':')[0].toLowerCase();

    // Check if monitoring channels already exist. if they do remove them
    if (server.StatusChannId && server.NumberChannId && server.CategoryId) {
      // Remove the channels
      try {
        await interaction.guild.channels.cache.get(server.StatusChannId).delete();
        await interaction.guild.channels.cache.get(server.NumberChannId).delete();
        await interaction.guild.channels.cache.get(server.CategoryId).delete();
      } catch (err) {
        console.error(err);
      }
    }

    // check if server has a defined ip
    if (!ip) {
      return interaction.reply('Please use`/setip` to set a ip to monitor!');
    }

    // Create category
    let Category;
    await interaction.guild.channels.create(`${ip}'s status`, {
      type: 'GUILD_CATEGORY',
      position: 0,
      permissionOverwrites: [{
        id: interaction.guild.me.roles.highest,
        allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT']
      }]
    }).then((channel) => {
      channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        CONNECT: false
      });
      Category = channel;
    })

    // Crate channels and add to category
    let StatusChan;
    await interaction.guild.channels.create('Updating status. . .', {
      type: 'GUILD_VOICE'
    }).then(async function (channel) {
      await channel.setParent(Category.id);
      channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        CONNECT: false
      });
      StatusChan = channel;
    })
    let NumberChan;
    await interaction.guild.channels.create('Updating players . . .', {
      type: 'GUILD_VOICE'
    }).then(async function (channel) {
      await channel.setParent(Category.id);
      channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        CONNECT: false
      });
      NumberChan = channel;
    })

    server.StatusChannId = StatusChan.id;
    server.NumberChannId = NumberChan.id;
    server.CategoryId = Category.id;

    const portnum = Number(server.IP.split(':')[1]);
    const port = portnum < 65536 || portnum > 0 ? portnum : NaN;

    if (server.Bedrock == true) {
      var pinger = util.statusBedrock(ip.split(':')[0].toLowerCase(), port ? port : 19132)
    } else {
      var pinger = util.status(ip.split(':')[0].toLowerCase(), port ? port : 25565)
    }

    pinger.then((pingresult) => {
      // Aternos servers stay online and display Offline in their MOTD when they are actually offline
      if (!pingresult || (ip.includes('aternos.me') && pingresult.version == '● Offline')) {
        // server is offline
        servoffline();
      } else {
        // server is online
        servonline(pingresult);
      }
    }).catch((error) => {
      // server is offline
      servoffline();
    });
    await server.save();
    return interaction.channel.send('The channels have been created successfully! Please allow five to 10 minutes for the channels to update.');
  }
}