const logger = require('../modules/nodeLogger.js')
const SERVER = require('../database/ServerSchema')
const { createCache, removeCache } = require('./cache')

module.exports = {
  async execute(client, server, result) {
    // Check if channels are defined
    if (!server.StatusChannId || !server.CategoryId) return
    if (!client.channels.cache.get(server.StatusChannId) || !client.channels.cache.get(server.CategoryId)) return

    try {
      // Change the name of the category to the right ip if it isn't
      if (!(client.channels.cache.get(server.CategoryId).name == server.IP + `'s status`)) {
        client.channels.cache
          .get(server.CategoryId)
          .setName(server.IP + `'s status`)
          .catch((e) => logger.warn('Error in cahannupd:' + e))
      }

      // server is online
      if (result) {
        if (server.StatusChannValue && server.StatusChannValue != 'online') {
          client.channels.cache
            .get(server.StatusChannId)
            .setName('🟢 ONLINE')
            .catch((e) => logger.warn('Error in cahannupd:' + e))
          updateChannValue('online')
        }
        /*
                //see https://discord.com/channels/892122095235006485/892124170115239937/939299623447719989
                //in the support server
        
                const chann = client.channels.cache.get(server.NumberChannId)
                chann.permissionOverwrites
                .edit(chann.guild.roles.everyone, {
                    VIEW_CHANNEL: true
                })
                .catch((e) => logger.warn('Error in cahannupd:' + e))
                chann.setName(`👥 Players online: ${result.players.online}`).catch((e) => logger.warn('Error in cahannupd:' + e))
                */
      }
      // server is offline
      else {
        if (server.StatusChannValue && server.StatusChannValue != 'offline') {
          client.channels.cache
            .get(server.StatusChannId)
            .setName('🔴 OFFLINE')
            .catch((e) => logger.warn('Error in cahannupd:' + e))
          updateChannValue('offline')
        }
        /* 
                //see https://discord.com/channels/892122095235006485/892124170115239937/939299623447719989
                //in the support server
        
                const chann = client.channels.cache.get(server.NumberChannId)
                chann.permissionOverwrites
                .edit(chann.guild.roles.everyone, {
                    VIEW_CHANNEL: false
                })
                .catch((e) => logger.warn('Error in cahannupd:' + e))
                chann.setName(`👥 Players online: 0`).catch((e) => logger.warn('Error in cahannupd:' + e))
                */
      }

      async function updateChannValue(val) {
        const s = await SERVER.findOne({ _id: server._id })
        s.StatusChannValue = val
        s.save()
        await removeCache('server', s._id)
        createCache('Server', s._id, s)
      }
    } catch (err) {
      console.error('Error in cahannupd: ' + err)
    }
  }
}
