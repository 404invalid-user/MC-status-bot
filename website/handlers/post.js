const { readdirSync } = require('fs')
const logger = require('../../modules/nodeLogger')
module.exports = (webServer, shards) => {
    readdirSync(__dirname + '/../post/').forEach((dir) => {
        const postReqFiles = readdirSync(__dirname + `/../post/${dir}/`).filter((file) => file.endsWith('.js'))
        for (let file of postReqFiles) {
            let postReqFile = require(__dirname + `/../post/${dir}/${file}`)
            if (postReqFile.path) {
                webServer.post(postReqFile.path, async (...args) => postReqFile.run(shards, ...args))
                console.log(postReqFile.path)
            } else {
                logger.error('post file dosnt contain a name or description. path: ' + `/${dir}/${file}`)
                continue
            }
        }
    })
    logger.info('loaded post handler')
}
