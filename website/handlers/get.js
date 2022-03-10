const path = require("path");
const logger = require('../../modules/nodeLogger');
const cache = require('../../modules/cache');
const { readdirSync } = require("fs");
module.exports = (webServer, shards) => {

    readdirSync(__dirname + '/../get/').forEach((dir) => {
        const getReqFiles = readdirSync(__dirname + `/../get/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of getReqFiles) {
            let getReqFile = require(__dirname + `/../get/${dir}/${file}`);
            if (getReqFile.path) {
                try {
                    if (getReqFile.dynamic == false) {
                        webServer.get(getReqFile.path, async(...args) => getReqFile.run(shards, ...args));
                        console.log(getReqFile.path)
                    };
                } catch (error) {
                    logger.error("executing. path: " + `./get/${dir}/${file}`);
                    continue;
                };
            } else {
                logger.error("get file dosnt contain a name or description. path: " + `./get/${dir}/${file}`);
                continue;
            };
        };
    });

    webServer.get('/server/:serverid', async(req,res) => {
        const s = await cache.lookup('Server', req.params.serverid);
        if (s == null) return res.status(404).sendFile(path.join(__dirname, '/../www/404.html'));
        require('../get/server/index.js').run(shards, req,res);
    });
    webServer.get('*', (req, res) => {
        res.status(404).sendFile(path.join(__dirname, '/../www/404.html'))
    });
    logger.info("loaded get handler");
}