const express = require('express')
const config = require('../config')
const logger = require('../modules/nodeLogger')
module.exports = (shards) => {
  if (!config.webserver.enabled) return
  logger.info('starting webserver service')
  const webserver = express()
  webserver.use((req, res, next) => {
    req.date = Date.now()
    next()
  })
  require('../website/index')(webserver, shards)
  const port = config.webserver.port ? config.webserver.port : 5000
  webserver.listen(port, () => {
    logger.success('web server listening on port ' + port)
  })
}
