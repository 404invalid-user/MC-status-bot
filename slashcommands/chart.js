

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');
const Discord = require('discord.js');
const { lookup } = require('../modules/cache.js');

module.exports = {
  name: 'chart',
  data: new SlashCommandBuilder()
    .setName('chart')
    .setDescription('make a chart with the logged info')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('the type of chart you want to see')
        .setRequired(true)
        .addChoice('uptime', 'uptime')
        .addChoice('playersonline', 'playersonline')
        .addChoice('mostactive', 'mostactive')),
  async execute(interaction, server, client) {

    const chartType = interaction.options.getString('type');
    if (!chartType) {
      return interaction.reply('Please specify what you want to chart! Use `mc!chart uptime`, `mc!chart playersonline` or `mc!chart mostactive`');
    }

    // Get the ip. data.IP holds the ip
    if (!server.Logging) {
      return interaction.reply('This server has logging set to off. please ask an admin to do `mc!log on`');
    }
    // Get the logs
    const logs = await lookup('Log', interaction.guild.id);
    // Check if logs exist
    if (logs.length <= 1 || logs == null || !server.IP) {
      return interaction.reply("This server doesn't have any logs, please wait for them to update!");
    }
    let xLabels = [];
    let yLabels = [];

    if (chartType == 'playersonline') {
      // Check if logs are empty
      if (logs.length == 0) {
        return interaction.reply('The logs are empty right now, please wait for them to update!');
      }

      // Set the options for chart.js
      var type = 'line',
        label = 'number of players',
        line = 2,
        embedTitle = `Number of players online on ${server.IP}`;

      logs.forEach((log) => {
        if (log.online == false) yLabels.push(0)
        else yLabels.push(log.playersOnline)

        xLabels.push(moment(log.timestamp).format('HH:mm'))
      })

      var embedDescription = `There have been a maximum of ${Math.max(...yLabels)} players online at once, and a minimum of ${Math.min(...yLabels)}.`;
    } else if (chartType == 'uptime') {
      // Check if logs are empty
      if (logs.length == 0) {
        return interaction.reply('The logs are empty right now, please wait for them to update!');
      }

      // Set the options for chart.js
      var type = 'line',
        label = 'uptime',
        embedTitle = `${server.IP}'s uptime`,
        line = 2,
        max = 1

      var up = 0,
        down = 0

      // calculate the uptime and percentage
      logs.forEach((log) => {
        if (log.online == true) {
          up++
          yLabels.push(1)
        } else {
          down++
          yLabels.push(0)
        }
        xLabels.push(moment(log.timestamp).format('HH:mm'));
      })
      var embedDescription = `${server.IP} was up for ${up * 5} minutes and down for ${down * 5} minutes. This means that ${server.IP} has a uptime percentage of ${Math.round(((up / (up + down)) * 100 + Number.EPSILON) * 100) / 100}%`;
    } else if (chartType == 'mostactive') {
      // Set the options for chart.js
      var type = 'bar',
        label = 'number of minutes played',
        line = 1,
        embedTitle = `Most active players on ${server.IP} in the last 24 hours`;

      var numberOfOccurrences = {},
        playersList = [];

      // Get all the players recorded in the logs into a array
      logs.forEach((log) => {
        if (log.playerNamesOnline) {
          const players = log.playerNamesOnline.split(',');
          playersList.push(...players);
        }
      });

      if (playersList.length == 0) {
        return interaction.reply(`There were no player names logged. Either there were no players on the server or your server doesn't provide the list of connected players.`);
      }

      // Create a object with the number of times a player has been online
      playersList.forEach(function (e) {
        if (numberOfOccurrences.hasOwnProperty(e)) numberOfOccurrences[e]++;
        else numberOfOccurrences[e] = 1
      })

      // Sort it by the value
      const sorted = Object.entries(numberOfOccurrences).sort(([c1, v1], [c2, v2]) => {
        return v2 - v1
      }).reduce((o, [k, v]) => ((o[k] = v), o), {});
      const arr = Object.entries(sorted);

      arr.forEach((element) => {
        xLabels.push(element[0])
        yLabels.push(element[1] * 5)
      })
      var embedDescription = `${xLabels[0]} was the most active player with ${yLabels[0]} minutes spent online in the last 24 hours.`;
    } else {
      return interaction.channel.send('`' + chartType + "` isn't a valid option! Use `/chart uptime`, `/chart playersonline` or `/chart mostactive`");
    }

    // Change the width of the chart based on the number of lines in the log
    switch (true) {
      case yLabels.length <= 30:
        var width = 500;
        break;
      case yLabels.length <= 40:
        var width = 600;
        break;
      case yLabels.length <= 50:
        var width = 700;
        break;
      case yLabels.length <= 60:
        var width = 900;
        break;
      default:
        var width = 1000;
        break;
    }

    // Chart.js
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height: 400
    })
    const lineColour = {fill: '8, 174, 228', border: '39, 76, 113', colour: '39, 76, 113'};
    const textColour = {time: '253, 253, 253', state: '253, 253, 253', title: '253, 253, 253'}

    const configuration = {
      type,
      data: {
        labels: xLabels,
        datasets: [{
          label,
          data: yLabels,
          fill: true,
          color: 'rgb('+lineColour.colour+')',
          backgroundColor: 'rgba('+lineColour.fill+', 0.2)',
          borderColor: 'rgba('+lineColour.border+', 1)',
          borderWidth: line,
          steppedLine: true
        }]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgb(' + textColour.title + ')',
              font: {
                size: 15
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'rgb(' + textColour.state + ')',
              fontSize: 15,
              stepSize: 1,
              max,
              callback: function (value) {
                if (chartType == 'uptime') {
                  if (value == 1) return 'online'
                  if (value == 0) return 'offline'
                } else return value
              }
            }
          },
          x: {
            ticks: {
              color: 'rgb(' + textColour.time + ')',
              fontSize: 13,
              stepSize: 1
            }
          }
        }
      }
    }

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);

    // Send embed
    const attachment = new Discord.MessageAttachment(image, 'chart.png');
    const embed = new Discord.MessageEmbed().setColor('#08AFE4').setTitle(embedTitle).setDescription(embedDescription).setImage('attachment://chart.png');
    interaction.reply({ embeds: [embed], files: [attachment] });

  }
}