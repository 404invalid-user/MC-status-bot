const cache = require('../../../modules/cache');
const logger = require('../../../modules/nodeLogger');
module.exports = {
    path: '/api/me',
    async run(shards, req, res) {
        try {
            if (req.user == null) return res.status(401).json({ message: '401: incorrect details please login again', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            const user = await cache.lookup('user', req.user._id);
            user.guilds = [];
            user.save = undefined;
            for (const g of req.user.guilds) {
                if (g.mutual && g.manage) {
                    const guild = await cache.lookup('server', g._id).catch((e) => { });
                    if (guild !== null) {
                        user.guilds.push(guild);
                    }
                }
            }
            return res.status(200).json({ message: '200: success', data: user, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
        } catch (err) {
            logger.error(err.stack || err);
            return res.status(500).json({ message: '500: unknown error please report this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
        }
    }
}
