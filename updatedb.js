const mongoose = require('mongoose')
const ServerSchema = require('./database/ServerSchema')
const run = async () => {
  // Connect to database
  await mongoose
    .connect('mongodb://bot:uihj7ig7rcv@51.81.17.245:25569/mcstatus', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database!'))
    .catch((err) => console.log(err.stack || err))

  let serversno = 0
  await ServerSchema.find()
    .then((result) => {
      result.forEach(async (server) => {
        serversno++
        server.checker = {
          channel: {
            status: 'offline',
            members: '0'
          },
          notification: {
            status: 'offline',
            members: '0'
          }
        }

        server.config = {
          notifications: {
            webhook: {
              enabled: false,
              url: 'http://nice.webhook.mcstatusbot.site/',
              content: '[ip] is [status]',
              for: { online: false, offline: false }
            },
            email: {
              enabled: false,
              emails: ['no-one@mcstatusbot.site'],
              subject: '[ip] is [status]',
              content: 'hello, this is an automated email saying [ip] is [status]',
              for: { online: false, offline: false }
            }
          },
          chart: {
            enabled: true,
            embed: {
              uptime: {
                title: "[ip]'s uptime",
                description:
                  '[ip] was up for [uptime] minutes and down for [downtime] minutes. This means that [ip] has a uptime percentage of [onlinepercent] and downtime percentage of [offlinepercent]',
                color: '#FFFFF'
              },
              playersonline: {
                title: 'Number of players online on [ip]',
                description: 'There have been a maximum of [maxplayers] players online at once, and a minimum of [minplayers].',
                color: '#FFFFF'
              },
              mostactive: {
                title: 'Most active players on [ip] in the last 24 hours',
                description: '[mostactive] was the most active player with [mostactiveminutes] minutes spent online in the last 24 hours.',
                color: '#FFFFF'
              }
            },
            graph: {
              text: {
                title: '253, 253, 253',
                time: '253, 253, 253',
                state: '253, 253, 253'
              },
              line: {
                fill: '8, 174, 228',
                border: '39, 76, 113'
              }
            }
          }
        }
        await server.save()
        console.log('updated: ' + server._id)
      })
      console.log('updated servers: ' + serversno)
    })
    .catch((err) => console.log(err.stack || err))

  return true
}

run()
