const logger = require('../../../modules/nodeLogger');
const cache = require('../../../modules/cache');
module.exports = {
    path: '/api/language',
    dynamic: false,
    async run(shards, req, res) {
        try {
            const loouplan = req.user !== null ? req.user.lan : req.query.lan;
            const lan = await cache.lookup('lan', loouplan);
            if (lan == null) return res.status(404).json({message:"404: that language has not been added yet", responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms'});
            return res.status(200).json({message: "200: success", lan: lan, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms'});
        } catch (err) {
            logger.error(err.stack || err);
            return res.status(500).json({message:"500: unknown error please report this", responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms'});
        }
    }
}