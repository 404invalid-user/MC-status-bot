const logger = require('../../../modules/nodeLogger');
module.exports = {
    path: '/api/request-data',
    async run(shards, req, res) {
        try {
            if (req.user == null) return res.status(401).json({ message: '401: incorrect details please login again', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            
            let currentUser = req.user;
            currentUser.accessCodes = [];
            for (const c of req.user.accessCodes) {
                currentUser.accessCodes = { browser: c.browser, code: '[REDACTED]' };
            }
            return res.status(200).attachment(`mcstatusbot-profile-info.json`).send(currentUser);
        } catch (err) {
            logger.error(err.stack || err);
            return res.status(500).json({ message: '500: unknown error please report this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
        }
    }
}
