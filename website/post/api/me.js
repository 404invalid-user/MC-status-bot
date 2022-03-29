const logger = require('../../../modules/nodeLogger')
const cache = require('../../../modules/cache')
module.exports = {
    path: '/api/me',

    async run(shards, req, res) {
        try {
            if (req.user == null) {
                return res.status(401).json({ message: '401: incorrect details please login again', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
            }
            if (req.body.data)
                return res
                    .status(400)
                    .json({ message: '400: please supply the whole user object with the changes made', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
            req.user.options.ip = req.body.data.options.ip
            req.user.options.darkMode = req.body.data.options.darkMode
            req.user.options.theme = req.body.data.options.theme
            if (req.user.lan != req.body.data.lan) {
                const lanfc = await cache.lookup('lan', req.body.data.lan)
                if (lanfc == null)
                    return res.status(400).json({ message: '400: supplied lan has not been translated', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
                req.user.lan = req.body.data.lan
            }
            await req.user.save()
            return res.status(200).json({ message: '200: success', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
        } catch (err) {
            logger.error(err.stack || err)
            return res.status(500).json({ message: '500: unknown error please report this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
        }
    }
}
