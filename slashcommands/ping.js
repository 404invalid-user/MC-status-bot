const util = require('minecraft-server-util');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  name: 'ping',
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping a minecraft server')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('the server ip')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The server type')
        .setRequired(false)
        .addChoice('java', 'java')
        .addChoice('bedrock', 'bedrock')
    ),
  async execute(interaction, server) {
    let pinger;
    let bedrock = false;
    let ip;
    let portnum;

    if (!interaction.options.getString('ip')) {
      await interaction.deferReply();
      ip = server.IP.split(':')[0].toLowerCase();
      portnum = Number(server.IP.split(':')[1]);
      bedrock = server.bedrock;
    } else {
      ip = interaction.options.getString('ip').split(':')[0].toLowerCase();
      portnum = Number(interaction.options.getString('ip').split(':')[1]);
    }
    const port = portnum < 65536 || portnum > 0 ? portnum : NaN;

    if (bedrock || interaction.options.getString('type') == 'bedrock' || interaction.options.getString('type') == 'b') {
      pinger = util.statusBedrock(ip, port ? port : 19132);
    } else {
      pinger = util.status(ip, port ? port : 25565);
    }

    pinger.then((result) => {
      if (result.version.protocol) online(result);
      else offline(`${ip} didn't return a ping.`, ip);
    }).catch((error) => {
      if (error.code == "ENOTFOUND") offline(`Unable to resolve ${ip}.\nCheck if you entered the correct ip!`, ip);
      else if (error.code == "ECONNREFUSED") offline(`Unable to resolve ${ip}.\nCan't find a route to the host!`, ip);
      else if (error.code == "EHOSTUNREACH") offline(`${ip} refused to connect.\nCheck if you specified the correct port!`, ip);
      else if (error.code == "ECONNRESET") offline(`${ip} abruptly closed the connection.\nThere is some kind of issue on the server side!`, ip);
      else if (error == "Error: Socket timed out while connecting") offline(`${ip} didn't return a ping.\nTimed out.`, ip);
      else {
        console.log("A error occurred while trying to ping: ", error);
        offline(`${ip} refused to connect.`, ip);
      }
      return;
    });

    // Server is online
    function online(result) {
      // If there is no icon use pack.png
      if (result.favicon == null) {
        var attachment = new Discord.MessageAttachment("https://i.ibb.co/YkRLWG8/down.png", "icon.png");
      } else {
        var attachment = new Discord.MessageAttachment(Buffer.from(result.favicon.substr('data:image/png;base64,'.length), 'base64'), "icon.png");
      }
      const embed = new Discord.MessageEmbed()
        .setColor('#008000')
        .setTitle(`${ip} is online`)
        .setDescription(result.motd.clean);

      // Add a players connected field if available
      if (result.players.samples && result.players.sample != null && result.players.sample.length > 0) {
        const playernames = result.players.sample.map(function (obj) {
          return obj.name;
        });
        embed.addField('Players connected:', '`' + playernames.toString().replace(/,/g, ', ') + '`', false);
      }

      embed.addFields({
        name: 'Players: ',
        value: 'Online: ' + '`' + result.players.online + '`' + '\nMax: ' + '`' + result.players.max + '`',
        inline: true
      }, {
        name: 'Version: ',
        value: '`' + result.version.name + '`',
        inline: true
      }).setThumbnail("attachment://icon.png");

      return interaction.editReply({ embeds: [embed], files: [attachment] });
    }

    // Server is offline or error
    function offline(errortxt, ip) {
      const embed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle(`${ip} is offline`)
        .setDescription(errortxt + '\n\n *If the server you are trying to ping\n is a bedrock server use `mc!ping [ip] bedrock`*')
        .setThumbnail("https://i.ibb.co/YkRLWG8/down.png");
      return message.editReply({ embeds: [embed] });
    }
  }
}