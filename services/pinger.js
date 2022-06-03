const cron = require('node-cron')
const config = require('../config')
const pingServer = require('../modules/ping')
const nodeLogger = require('../modules/nodeLogger')
const notification = require('../modules/notification')
const wait = (s) => new Promise((resolve) => setTimeout(resolve, parseFloat(s.toString() + '000')))

module.exports = () => {
  if (!config.pinger.enabled) return
  nodeLogger.info('starting pinger service')
  // Call the pinger every x minutes
  cron.schedule(`*/${config.pinger.interval && parseInt(config.pinger.interval) > 1 && parseInt(config.pinger.interval) < 60 ? config.pinger.interval : '5'} * * * *`, () => {
    try {
      pinger()
    } catch (err) {
      nodeLogger.error('Error while updating channels: ' + err.stack || err)
    } finally {
      nodeLogger.info('Done updating channels')
    }
  })
  if (!config.pinger.runAtStart) return
  try {
    pinger()
  } catch (err) {
    nodeLogger.error('Error while updating channels: ' + err.stack || err)
  } finally {
    nodeLogger.info('Done updating channels')
  }
  return
}

async function pinger() {
  const { getallCache, lookup } = require('../modules/cache')
  const servers = await getallCache('server')
  for (const sv of servers) {
    if (!sv.IP || sv.IP == '' || sv.IP == ' ' || sv.IP.length < 1) continue
    const server = await lookup('server', sv._id)
    try {
      const serverStats = await pingServer(server)
      notification(server, serverStats.status).catch((err) => {
        nodeLogger.error(err.stack || err)
      })
      if (server.logger) logs(server, serverStats.playersSample)
      await wait(1)
    } catch (err) {
      console.log(err) /*ignore incorrect ip error for now*/
    }
  }
}

async function logs(server, playersSample) {
  const logsraw = await lookup('log', server._id)
  if (logsraw == null) return
  //delete after 24 hours
  if (logsraw.logs.length >= 289) {
    logsraw.logs = []
    logsraw.save()
  }
  // Log the status
  if (server.ping.status == 'online') {
    if (playersSample && playersSample != null && playersSample > 0) {
      const playernames = playersSample.map((obj) => obj.name)
      logsraw.logs.push({
        online: true,
        playersOnline: server.ping.members,
        playerNamesOnline: playernames.toString()
      })
    } else {
      logsraw.logs.push({
        online: true,
        playersOnline: server.ping.members
      })
    }
  } else {
    logsraw.logs.push({
      online: false
    })
  }
  logsraw.save()
}
