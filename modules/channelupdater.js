const logger = require('../modules/nodeLogger.js')
module.exports = async (client, server) => {
    // Check if channels are defined
    if (!server.StatusChannId || !server.CategoryId) return
    if (!server.pinger) return
    if (!server.channel) {
        server.checker['channel'] = {
            status: server.pinger.status,
            members: server.pinger.members
        }
    } else {
        if (!server.checker.channel.status) {
            server.checker.channel.status = server.pinger.status
        }
        if (server.MemberChannEnabled) {
            if (!server.checker.channel.members) {
                server.checker.channel.members = server.pinger.members
            }
        }
    }
    //channel status does not match pinner value
    if (server.checker.channel.status !== server.pinger.status) {
        //check if online or offline
        if (server.pinger.status == 'online') {
            await client.channels.cache
                .get(server.StatusChannId)
                .setName('🟢 ONLINE')
                .catch((e) => logger.warn('Error in cahannupd:' + e))
            server.channel.status = 'online'
            console.log("settinv chan online")
        } else if (server.pinger.status == 'offline') {
            await client.channels.cache
                .get(server.StatusChannId)
                .setName('🔴 OFFLINE')
                .catch((e) => logger.warn('Error in cahannupd:' + e))
            server.channel.status = 'offline'
        }
    }
    if (server.MemberChannEnabled) {
        if (server.checker.channel.members !== server.pinger.members) {
            const chann = client.channels.cache.get(server.NumberChannId)
            chann.permissionOverwrites.edit(chann.guild.roles.everyone, { VIEW_CHANNEL: true }).catch((e) => logger.warn('Error in cahannupd:' + e))
            await chann.setName(`👥 Players online: ${server.pinger.members}`).catch((e) => logger.warn('Error in cahannupd:' + e))
            server.checker.channel.members = server.pinger.members
        }
    }
    server.save()
}
