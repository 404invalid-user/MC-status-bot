const util = require('minecraft-server-util');

/**
 * pings the servers ip and returns status.
 * @param {Object} server - The current guild object from cache module.
 * @returns {Object} - server status and information.
 */
module.exports = async(server) => {

    const ip = server.IP.split(':')[0];
    const portnum = parseInt(server.IP.split(':')[1]);
    const port = portnum < 65536 && portnum > 0 ? portnum : undefined;

    if (ip.split(':')[0].toLowerCase().length <= 0) throw "Error: guild must have ip";
    try {
        if (server.Bedrock == true) {
            var result = await util.statusBedrock(ip.split(':')[0].toLowerCase(), port ? port : 19132);
        } else {
            var result = await util.status(ip.split(':')[0].toLowerCase(), port ? port : 25565);
        }

        // Aternos servers stay online and display Offline in their MOTD when they are actually offline
        if (!result || (server.IP.includes('aternos.me') && result.version == '§4● Offline')) {
            // server is offline
            server['pinger'] = {
                status: 'offline',
                members: '0',
                motd: {
                    text: "",
                    html: ""
                },
                error: "ATERNOSOFFLINE"
            }
            await server.save();
            return { status: "offline", error: "ATERNOSOFFLINE", online: 0, max: 0, motd: { txt: "", html: "" } };
        } else {
            // server is online
            server['pinger'] = {
                status: 'online',
                members: result.players.online,
                max: result.players.max,
                motd: result.motd,
                error: "NONE"
            }
            await server.save();
            return { status: "online", error: "NONE", online: result.players.online, max: result.players.max, motd: result.motd };
        }

    } catch (error) {
        server['pinger'] = {
            status: 'offline',
            members: '0',
            motd: {
                text: "",
                html: ""
            },
            error: error.code
        }
        await server.save();
        return { status: "offline", error: error.code, online: 0, max: 0, motd: { txt: "", html: "" } };
    }
}