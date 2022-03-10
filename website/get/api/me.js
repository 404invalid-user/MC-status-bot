const logger = require('../../../modules/nodeLogger')
const cache = require('../../../modules/cache')
module.exports = {
  path: '/api/me',
  dynamic: false,
  async run(shards, req, res) {
    try {
      if (req.user == null) {
        return res.status(401).json({ message: '401: incorrect details please login again', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      }
      let userGuilds = []
      for (const g of req.user.guilds) {
        if (g.mutual) {
          const guild = await cache.lookup('Server', g.id).catch((e) => {})
          if (guild !== null) {
            userGuilds.push(guild)
          }
        }
      }
      req.user.guilds = userGuilds
      return res.status(200).json({ message: '200: success', me: req.user, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
    } catch (err) {
      logger.error(err.stack || err)
      return res.status(500).json({ message: '500: unknown error please report this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
    }
  }
}
