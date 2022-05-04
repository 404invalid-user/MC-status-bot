const Log = require('../database/logSchema')
const { lookup } = require('../modules/cache.js')
const logger = require('../modules/nodeLogger.js')

module.exports = {
  async execute(result, server) {
    // Check if server has more than 288 logs
    const logsraw = await lookup('Log', server._id)
    if (logsraw == null) return
    //delete after 24 hours
    if (logsraw.logs.length >= 289) {
      logsraw.logs = []
      logsraw.save()
    }
    // Log the status
    if (result) {
      if (result.players.sample && result.players.sample != null && result.players.sample.length > 0) {
        const playernames = result.players.sample.map(function (obj) {
          return obj.name
        })
        logsraw.logs.push({
          online: true,
          playersOnline: result.players.online,
          playerNamesOnline: playernames.toString()
        })
      } else {
        logsraw.logs.push({
          online: true,
          playersOnline: result.players.online
        })
      }
    } else {
      logsraw.logs.push({
        online: false
      })
    }
    logsraw.save()
  }
}
