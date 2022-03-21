const timezones = require('../../../modules/timezones');
module.exports = {
    path: '/api/timezones',
    dynamic: false,
    async run(shards, req, res) {
        if (req.user == null) {
            return res.status(401).json({ message: '401: login', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
        }
        res.json(timezones);
    }
}