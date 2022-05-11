const pingServer = require('./ping');
const nodeLogger = require('./nodeLogger.js');
const notification = require('./notification');
const wait = (s) => new Promise((resolve) => setTimeout(resolve, parseFloat(s.toString() + '000')));
const { getallCache, lookup } = require('../modules/cache');


module.exports = async() => {
    const servers = await getallCache('Server');
    for (const sv of servers) {
        if (!sv.IP || sv.IP == "" || sv.IP == " " || sv.IP.length < 1) continue;
        const server = await lookup('Server', sv._id);
        try {
            const serverStats = await pingServer(server);
            if (serverStats.status == "online") {
                notification(server, "online").catch(err => {
                    nodeLogger.error(err.stack || err);
                });
            } else if (serverStats.status == "offline") {
                notification(server, "offline", serverStats.error).catch(err => {
                    nodeLogger.error(err.stack || err);
                });
            }
            await wait(1);
        } catch (err) { console.log(err) /*ignore incorrect ip error for now*/ }

    }
}