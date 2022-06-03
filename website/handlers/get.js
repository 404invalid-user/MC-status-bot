const path = require('path')
const logger = require('../../modules/nodeLogger')
const cache = require('../../modules/cache')
const { readdirSync } = require('fs')
module.exports = (webServer, shards) => {
  readdirSync(__dirname + '/../get/').forEach((dir) => {
    const getReqFiles = readdirSync(__dirname + `/../get/${dir}/`).filter((file) => file.endsWith('.js'))
    for (let file of getReqFiles) {
      let getReqFile = require(__dirname + `/../get/${dir}/${file}`)
      if (!getReqFile.path) {
        logger.error('get file dosnt contain a name or description. path: ' + `./get/${dir}/${file}`)
        continue
      }
      try {
        if (!getReqFile.dynamic) {
          webServer.get(getReqFile.path, async (...args) => getReqFile.run(shards, ...args))
        }
      } catch (error) {
        logger.error('executing. path: ' + `./get/${dir}/${file}`)
        continue
      }
    }
  })

  webServer.get('/server/:serverid', async (req, res) => {
    const s = await cache.lookup('server', req.params.serverid)
    if (s == null) return res.status(404).sendFile(path.join(__dirname, '/../dist/404.html'))
    return res.status(200).sendFile(path.join(__dirname, '/../dist/index.html'))
  })
  webServer.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/../dist/404.html'))
  })
  logger.info('loaded get handler')
}
