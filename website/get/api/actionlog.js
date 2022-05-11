const cache = require('../../../modules/cache')
const logger = require('../../../modules/nodeLogger')
const actionlog = require('../../../database/auditlogSchema.js')
module.exports = {
  path: '/api/actionlog',
  async run(shards, req, res) {
    try {
      if (req.user == null) return res.status(401).json({ message: '401: login', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      if (!req.query.id || req.query.id == 'undefined')
        return res.status(404).json({ message: '404: server not found', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      const server = await cache.lookup('Server', req.query.id)
      if (server == null) return res.status(404).json({ message: '404: server not found', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      let canAccessServer = false
      for (const g of req.user.guilds) {
        if (g._id == server._id) {
          canAccessServer = true
        }
      }
      if (req.user.admin) canAccessServer = true
      if (!canAccessServer) return res.status(403).json({ message: '403: Forbidden you can not access this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })

      const myServerActions = actionlog.find({ guild: server.id })
      return res.status(200).json({ message: '200: success', data: myServerActions, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
    } catch (err) {
      logger.error(err.stack || err)
      return res.status(500).json({ message: '500: unknown error please report this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
    }
  }
}
