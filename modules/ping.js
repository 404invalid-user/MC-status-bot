const util = require('minecraft-server-util')

/**
 * pings the servers ip and returns status.
 * @param {Object} server - The current guild object from cache lookup.
 * @returns {Object} - server status and information.
 */
module.exports = async (server) => {
  const ip = server.IP.split(':')[0]
  const portnum = parseInt(server.IP.split(':')[1])
  const port = portnum < 65536 && portnum > 0 ? portnum : undefined

  if (ip.split(':')[0].toLowerCase().length <= 0) throw 'Error: guild must have ip'
  try {
    let result
    if (server.Bedrock == true) {
      result = await util.statusBedrock(ip.split(':')[0].toLowerCase(), port ? port : 19132)
    } else {
      result = await util.status(ip.split(':')[0].toLowerCase(), port ? port : 25565)
    }

    // Aternos servers stay online and display Offline in their MOTD when they are actually offline
    if (!result || (server.IP.includes('aternos.me') && result.version == '§4● Offline')) {
      // server is offline
      server['ping'] = {
        status: 'offline',
        members: '0',
        motd: {
          text: '',
          html: ''
        },
        error: 'ATERNOSOFFLINE'
      }
      await server.save()
    } else {
      // server is online
      server['ping'] = {
        status: 'online',
        members: result.players.online,
        max: result.players.max,
        motd: result.motd,
        error: 'NONE'
      }
      await server.save()
    }
    return { ...server.ping, playersSample: result.players.sample }
  } catch (error) {
    server['ping'] = {
      status: 'offline',
      members: '0',
      motd: {
        text: '',
        html: ''
      },
      error: error.code
    }
    await server.save()
    return { ...server.ping, playersSample: null }
  }
}
