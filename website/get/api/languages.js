const path = require('path');
const logger = require('../../../modules/nodeLogger');
const cache = require('../../../modules/cache');
module.exports = {
    path: '/api/languages',
    dynamic: false,
    async run(shards, req, res) {
        try {
            const returnLans = [{ iso: 'en', flag: '' }];
            const all = await cache.getallCache('lan');
            for (const c of all) {
                returnLans.push({ iso: c.iso, flag: c.flag });
            }
            return res.status(200).json({message: "200: success",lans: returnLans, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms'});
        } catch (err) {
            logger.error(err.stack || err);
            return res.status(500).json({message:"500: unknown error please report this", responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms'});
        }
    }
}