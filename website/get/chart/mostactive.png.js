const path = require('path')
const translate = require('../../../modules/translate')
const moment = require('moment')
const cache = require('../../../modules/cache.js')

const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
module.exports = {
  path: '/chart/mostactive.png',
  dynamic: false,
  async run(shards, req, res) {
    try {
      if (req.user == null) {
        return res.status(401).json({ message: '401: login', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      }
      if (!req.query.id || req.query.id == 'undefined')
        return res.status(404).json({ message: '404: server not found', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      const server = await cache.lookup('Server', req.query.id)
      if (server == null) return res.status(404).json({ message: '404: server not found', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })

      let canAccessServer = false
      for (const g of req.user.guilds) {
        if (g.id == server._id) {
          canAccessServer = true
        }
      }
      if (req.user.admin) canAccessServer = true
      if (!canAccessServer) return res.status(403).json({ message: '403: Forbidden you can not access this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })

      // Get the ip. data.IP holds the ip
      if (!server.Logging) {
        return res.status(200).send(await translate(server.lan, 'This server has logging set to off. please ask an admin to do `/log value: on`'))
      }
      // Get the logs
      const logs = await cache.lookup('Log', server._id)
      // Check if logs exist
      if (logs.length <= 1 || logs == null || !server.IP) {
        return res.status(200).send(await translate(server.lan, "This server doesn't have any logs, please wait for them to update!"))
      }

      //vars to push data to depending which graph you select
      let yLabels = []
      let xLabels = []

      let playersList = []

      logs.forEach((log) => {
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
          xLabels.push(element[0])
          yLabels.push(element[1] * 5)
        })
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
        height: 400,
        backgroundColour: 'rgb(47, 49, 54)'
      })
      const lineColour = { fill: '8, 174, 228', border: '39, 76, 113', colour: '39, 76, 113' }
      const textColour = { time: '253, 253, 253', state: '253, 253, 253', title: '253, 253, 253' }

      if (server.config.enabled) {
        lineColour.fill = server.config.chart.graph.line.fill
        lineColour.border = server.config.chart.graph.line.border
        textColour.title = server.config.chart.graph.text.title
        textColour.time = server.config.chart.graph.text.time
        textColour.state = server.config.chart.graph.text.state
      }

      const configuration = {
        type: 'bar',
        data: {
          labels: xLabels,
          datasets: [
            {
              label: `${await translate(server.lan, 'Number of minutes played')}`,
              data: yLabels,
              fill: true,
              color: 'rgb(' + lineColour.colour + ')',
              backgroundColor: 'rgba(' + lineColour.fill + ', 0.2)',
              borderColor: 'rgba(' + lineColour.border + ', 1)',
              borderWidth: 1,
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
                  return value
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
      res.contentType('png').send(image)
    } catch (err) {
      console.log(err.stack)
      res.sendFile(path.join(`${__dirname}/../../dist/down.png`))
    }
  }
}

//TODO: make generate chart then redirect to /chart/YYYY/MM/DD/HH/name.png
