const logger = require('../modules/nodeLogger.js')
module.exports = async (client, server) => {
  // Check if channels are defined
  if (!server.StatusChannId || !server.CategoryId) return
  if (!server.pinger) return
  if (!server.channel) {
    server['channel'] = {
      status: server.pinger.status,
      members: server.pinger.members
    }
  } else {
    if (!server.channel.status) {
      server.channel.status = server.pinger.status
    }
    if (server.MemberChannEnabled) {
      if (!server.channel.members) {
        server.channel.members = server.pinger.members
      }
    }
  }
  //channel status does not match pinner value
  if (server.channel.status !== server.pinger.status) {
    //check if online or offline
    if (server.pinger.status == 'online') {
      client.channels.cache
        .get(server.StatusChannId)
        .setName('🟢 ONLINE')
        .catch((e) => logger.warn('Error in cahannupd:' + e))
      server.channel.status = 'online'
    } else if (server.pinger.status == 'offline') {
      client.channels.cache
        .get(server.StatusChannId)
        .setName('🔴 OFFLINE')
        .catch((e) => logger.warn('Error in cahannupd:' + e))
      server.channel.status = 'offline'
    }
  }
  if (server.MemberChannEnabled) {
    if (server.channel.members !== server.pinger.members) {
      const chann = client.channels.cache.get(server.NumberChannId)
      chann.permissionOverwrites.edit(chann.guild.roles.everyone, { VIEW_CHANNEL: true }).catch((e) => logger.warn('Error in cahannupd:' + e))
      chann.setName(`👥 Players online: ${server.pinger.members}`).catch((e) => logger.warn('Error in cahannupd:' + e))
      server.channel.members = server.pinger.members
    }
  }
  server.save()
}
