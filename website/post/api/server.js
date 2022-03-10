const logger = require('../../../modules/nodeLogger')
const cache = require('../../../modules/cache')
module.exports = {
  path: '/api/server',
  dynamic: false,
  async run(shards, req, res) {
    try {
      if (req.user == null) {
        return res.status(401).json({ message: '401: incorrect details please login again', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      }
      const server = await cache.lookup('Server', req.body.data._id)
      if (server == null) return res.status(404).json({ message: '404: server not found', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      let canAccessServer = false
      for (const g of req.user.guilds) {
        if (g.id == server._id && g.admin == true) {
          canAccessServer = true
        }
      }
      //let admins access any server
      if (req.user.admin) canAccessServer = true
      if (!canAccessServer) return res.status(403).json({ message: '403: Forbidden you can not access this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })

      server.IP = req.body.data.IP
      server.config = req.body.data.config
      server.Bedrock = req.body.data.Bedrock
      server.Logging = req.body.data.Logging
      server.CategoryId = req.body.data.CategoryId
      server.StatusChannId = req.body.data.StatusChannId
      server.NumberChannId = req.body.data.NumberChannId
      server.MemberChannEnabled = req.body.data.MemberChannEnabled
      await server.save()
      return res.status(200).json({ message: '200: success', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
    } catch (err) {
      logger.error(err.stack || err)
      return res.status(500).json({ message: '500: unknown error please report this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
    }
  }
}
