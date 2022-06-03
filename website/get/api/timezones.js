const timezones = require('../../../modules/timezones');
module.exports = {
    path: '/api/timezones',
    async run(shards, req, res) {
        res.json({ message: '200: success', data: timezones, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
    }
}
