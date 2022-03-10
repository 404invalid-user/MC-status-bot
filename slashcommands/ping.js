const util = require('minecraft-server-util');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const translate = require('../modules/translate')
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
    await interaction.deferReply();

    if (!interaction.options.getString('ip')) {
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
    let text = '';
    pinger.then(async (result) => {
      if (result.version.protocol) {
        online(result);
      } else {
        text = await translate(serverlan, "didn't return a ping.")
        offline(`${ip} ${text}`, ip);
      }
    }).catch(async (error) => {
      if (error.code == "ENOTFOUND") {
        
          offline(`${await translate(server.lan, "Unable to resolve")} ${ip}.\n${await translate(server.lan, "Check if you entered the correct ip!")}`, ip);
      } else if (error.code == "ECONNREFUSED") {
        offline(`${await translate(server.lan, "Unable to resolve")} ${ip}.\n${await translate(server.lan, "Can't find a route to the host!")}`, ip);
      } else if (error.code == "EHOSTUNREACH") {
        offline(`${ip} ${await translate(server.lan, "refused to connect.")}\n${await translate(server.lan, "Check if you specified the correct port!")}`, ip);
      } else if (error.code == "ECONNRESET") {
        offline(`${ip} ${await translate(server.lan, "abruptly closed the connection.")}\n${await translate(server.lan, "There is some kind of issue on the server side!")}`, ip);
      } else if (error == "Error: Socket timed out while connecting") {
        offline(`${ip} ${await translate(server.lan, "didn't return a ping.")}\n${await translate(server.lan, "Timed out.")}`, ip);
      } else {
        console.log("A error occurred while trying to ping: ", error);
        offline(`${ip} ${await translate(server.lan, "refused to connect.")}`, ip);
      }
      return;
    });

    // Server is online
    async function online(result) {
      // If there is no icon use pack.png
      if (result.favicon == null) {
        var attachment = new Discord.MessageAttachment("https://www.mcstatusbot.site/down.png", "icon.png");
      } else {
        var attachment = new Discord.MessageAttachment(Buffer.from(result.favicon.substr('data:image/png;base64,'.length), 'base64'), "icon.png");
      }
      const embed = new Discord.MessageEmbed()
        .setColor('#008000')
        .setTitle(`${ip} ${await translate(server.lan, "is online")}`)
        .setDescription(result.motd.clean);

      // Add a players connected field if available
      if (result.players.samples && result.players.sample != null && result.players.sample.length > 0) {
        const playernames = result.players.sample.map(function (obj) {
          return obj.name;
        });
        embed.addField(`${await translate(server.lan, "Players")} ${await translate(server.lan, "connected")}:`, '`' + playernames.toString().replace(/,/g, ', ') + '`', false);
      }

      embed.addFields({
        name: `${await translate(server.lan, "Players")}: `,
        value: 'Online: ' + '`' + result.players.online + '`' + `\n${await translate(server.lan, "Max")}: ` + '`' + result.players.max + '`',
        inline: true
      }, {
        name: 'Version: ',
        value: '`' + result.version.name + '`',
        inline: true
      }).setThumbnail("attachment://icon.png");

      return interaction.editReply({ embeds: [embed], files: [attachment] });
    }

    // Server is offline or error
    async function offline(errortxt, ip) {
      const embed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle(`${ip} ${await translate(server.lan, "is offline")}`)
        .setDescription(errortxt + `\n\n *${await translate(server.lan, "If the server you are trying to ping is a bedrock server set the bedrock option to yes in")} \`/ping\`*`)
        .setThumbnail("https://www.mcstatusbot.site/down.png");
      return interaction.editReply({ embeds: [embed] });
    }
  }
}