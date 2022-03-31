const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const { SlashCommandBuilder } = require('@discordjs/builders')
const moment = require('moment')
const Discord = require('discord.js')
const { lookup } = require('../modules/cache.js')
const translate = require('../modules/translate')

module.exports = {
  name: 'chart',
  data: new SlashCommandBuilder()
    .setName('chart')
    .setDescription('make a chart with the logged info')
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('the type of chart you want to see')
        .setRequired(true)
        .addChoice('uptime', 'uptime')
        .addChoice('playersonline', 'playersonline')
        .addChoice('mostactive', 'mostactive')
    ),
  async execute(interaction, server, client) {
    await interaction.deferReply()
    const chartType = interaction.options.getString('type')
    if (!chartType) {
      return interaction.editReply(await translate(server.lan, 'Please specify what you want to chart! Use `/chart uptime`, `/chart playersonline` or `/chart mostactive`'))
    }

    // Get the ip. data.IP holds the ip
    if (!server.Logging) {
      return interaction.editReply(await translate(server.lan, 'This server has logging set to off. please ask an admin to do `/log value: on`'))
    }
    // Get the logs
    const logsraw = await lookup('Log', interaction.guild.id)
    if (logsraw == null) return interaction.editReply(await translate(server.lan, "This server doesn't have any logs, please wait for them to update!"))
    const logs = logsraw.logs
    // Check if logs exist
    if (logs.length <= 1 || logs == null || !server.IP) {
      return interaction.editReply(await translate(server.lan, "This server doesn't have any logs, please wait for them to update!"))
    }

    //type of grapgh to show
    let type = 'line'
    let line = 2
    if (chartType == 'mostactive') {
      type = 'bar'
      line = 1
    }

    //vars to push data to depending which graph you select
    let yLabels = []
    let xLabels = []

    let playersOnline = []
    let mcServerUptime = []
    let playersList = []
    mostActive = {
      name: '',
      time: ''
    }

    let uptime = {
      online: 0,
      offline: 0
    }
    logs.forEach((log) => {
      //playersonline
      if (log.online == false) {
        playersOnline.push(0)
        uptime.offline++
        mcServerUptime.push(0)
      } else {
        playersOnline.push(log.playersOnline)
        uptime.online++
        mcServerUptime.push(1)
      }
      if (log.playerNamesOnline) {
        const players = log.playerNamesOnline.split(',')
        playersList.push(...players)
      }

      xLabels.push(moment(log.timestamp).format('HH:mm'))
    })

    if (playersList.length > 0) {
      let numberOfOccurrences = {}
      // Create a object with the number of times a player has been online
      playersList.forEach(function (e) {
        if (numberOfOccurrences.hasOwnProperty(e)) numberOfOccurrences[e]++
        else numberOfOccurrences[e] = 1
      })
      // Sort it by the value
      const sorted = Object.entries(numberOfOccurrences)
        .sort(([c1, v1], [c2, v2]) => {
          return v2 - v1
        })
        .reduce((o, [k, v]) => ((o[k] = v), o), {})
      Object.entries(sorted).forEach((element) => {
        mostActive.name = element[0]
        mostActive.time = element[1] * 5
      })
    }

    //[ip] = server ip
    //[name] = server name
    //[motd] = server motd
    //[maxplayers] = most players on server
    //[minplayers] = min players on server
    //[uptime] = server uptime in minutes
    //[downtime] = server downtime in minutes
    //[onlinepercent] = percentage of online
    //[offlinepercent] = percentage of offline
    //[mostactivename] = most active person on server
    //[mostactivetime] = most active person on server time

    function formatText(text) {
      let edit = text
        .replaceAll('[ip]', server.IP)
        .replaceAll('[ip-noport]', server.IP.split(':')[0])
        .replaceAll('[name]', server.name)
        .replaceAll('[maxplayersonline]', Math.max(...playersOnline))
        .replaceAll('[minplayersonline]', Math.min(...playersOnline))
        .replaceAll('[uptime]', uptime.online * 5)
        .replaceAll('[downtime]', uptime.offline * 5)
        .replaceAll('[uptimepercent]', `${Math.round(((uptime.online / (uptime.online + uptime.offline)) * 100 + Number.EPSILON) * 100) / 100}%`)
        .replaceAll('[downtimepercent]', `${Math.round(((uptime.offline / (uptime.online + uptime.offline)) * 100 + Number.EPSILON) * 100) / 100}%`)
        .replaceAll('[mostactivename]', mostActive.name)
        .replaceAll('[mostactivetime]', mostActive.time)
      return edit
    }

    let embedTitle = ''
    let embedDescription = ''
    let embedColour = '#08AFE4'
    let label = ''

    if (chartType == 'playersonline') {
      label = await translate(server.lan, 'Number of players')
      embedTitle = server.config.chart.enabled ? formatText(server.config.chart.embed.playersonline.title) : `Number of players online on ${server.IP}`
      embedDescription = server.config.chart.enabled
        ? formatText(server.config.chart.embed.playersonline.description)
        : `There have been a maximum of ${Math.max(...playersOnline)} players online at once, and a minimum of ${Math.min(...playersOnline)}.`
      if (server.config.chart.enabled) embedColour = server.config.chart.embed.playersonline.color
      yLabels = playersOnline
    } else if (chartType == 'uptime') {
      label = await translate(server.lan, 'Uptime')
      embedTitle = server.config.chart.enabled ? formatText(server.config.chart.embed.uptime.title) : `${server.IP}'s uptime`
      embedDescription = server.config.chart.enabled
        ? formatText(server.config.chart.embed.uptime.description)
        : `${server.IP} was up for ${uptime.online * 5} minutes and down for ${uptime.offline * 5} minutes. This means that ${server.IP} has a uptime percentage of ${
            Math.round(((uptime.online / (uptime.online + uptime.offline)) * 100 + Number.EPSILON) * 100) / 100
          }%`
      if (server.config.chart.enabled) embedColour = server.config.chart.embed.uptime.color
      yLabels = mcServerUptime
    } else if (chartType == 'mostactive') {
      label = await translate(server.lan, 'Number of minutes played')
      embedTitle = server.config.chart.enabled ? formatText(server.config.chart.embed.mostactive.title) : `Most active players on ${server.IP} in the last 24 hours`
      embedDescription = server.config.chart.enabled
        ? formatText(server.config.chart.embed.mostactive.description)
        : `${mostActive.name} was the most active player with ${mostActive.time} minutes spent online in the last 24 hours.`
      if (server.config.chart.enabled) embedColour = server.config.chart.embed.mostactive.color
      xLabels.push(mostActive.name)
      yLabels.push(mostActive.time)
    }

    // Change the width of the chart based on the number of lines in the log
    switch (true) {
      case yLabels.length <= 30:
        var width = 500
        break
      case yLabels.length <= 40:
        var width = 600
        break
      case yLabels.length <= 50:
        var width = 700
        break
      case yLabels.length <= 60:
        var width = 900
        break
      default:
        var width = 1000
        break
    }

    // Chart.js
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height: 400
    })
    const lineColour = { fill: '8, 174, 228', border: '39, 76, 113', colour: '39, 76, 113' }
    const textColour = { time: '253, 253, 253', state: '253, 253, 253', title: '253, 253, 253' }

    if (server.config.chart.enabled) {
      lineColour.fill = server.config.chart.graph.line.fill
      lineColour.border = server.config.chart.graph.line.border
      textColour.title = server.config.chart.graph.text.title
      textColour.time = server.config.chart.graph.text.time
      textColour.state = server.config.chart.graph.text.state
    }

    const configuration = {
      type,
      data: {
        labels: xLabels,
        datasets: [
          {
            label,
            data: yLabels,
            fill: true,
            color: 'rgb(' + lineColour.colour + ')',
            backgroundColor: 'rgba(' + lineColour.fill + ', 0.2)',
            borderColor: 'rgba(' + lineColour.border + ', 1)',
            borderWidth: line,
            steppedLine: true
          }
        ]
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
              max: 1,
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

    const image = await chartJSNodeCanvas.renderToBuffer(configuration)

    // Send embed
    const attachment = new Discord.MessageAttachment(image, 'chart.png')
    const embed = new Discord.MessageEmbed().setColor(embedColour).setTitle(embedTitle).setDescription(embedDescription).setImage('attachment://chart.png')
    interaction.editReply({ embeds: [embed], files: [attachment] })
  }
}
