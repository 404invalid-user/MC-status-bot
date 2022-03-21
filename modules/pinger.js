const logger = require('./logger.js')
const util = require('minecraft-server-util')
const { getallCache, lookup } = require('../modules/cache.js')
const notification = require('./notification');

const wait = (s) => {
  return new Promise((resolve) => setTimeout(resolve, parseFloat(s.toString() + '000')))
}
const online = async (id, members,motd,maxMembers,client) => {
  const server = await lookup('Server', id)
  notification(client, 'online', server)
  server['pinger'] = {
    status: 'online',
    members: members,
    motd:motd,
    maxMembers
  }
  
  server.save()
}

const offline = async (id,client) => {
  const server = await lookup('Server', id)
  notification(client, 'offline', server)
  server['pinger'] = {
    status: 'offline',
    members: '0'
  }
  server.save()
}

module.exports = {
  async execute(client) {
    const servers = await getallCache('Server')
    for (const server of servers) {
      if (!server.IP) continue

      const ip = server.IP.split(':')[0]
      const portnum = parseInt(server.IP.split(':')[1])
      const port = portnum < 65536 && portnum > 0 ? portnum : undefined

      if (server.Bedrock == true) {
        var pinger = util.statusBedrock(ip.split(':')[0].toLowerCase(), port ? port : 19132)
      } else {
        var pinger = util.status(ip.split(':')[0].toLowerCase(), port ? port : 25565)
      }

      pinger
        .then((result) => {
          // Aternos servers stay online and display Offline in their MOTD when they are actually offline
          if (!result || (server.IP.includes('aternos.me') && result.version == '§4● Offline')) {
            // server is offline
            offline(server._id, client)
            if (server.Logging == true) {
              logger.execute('', server)
            }
          } else {
            // server is online
            online(server._id, result.players.online,result.motd.html,result.players.max, client)
            if (server.Logging == true) {
              logger.execute(result, server)
            }
          }
        })
        .catch((error) => {
          // server is offline
          offline(server._id, client)
          if (server.Logging == true) {
            logger.execute('', server)
          }
        })
      await wait(1)
    }
  }
}
