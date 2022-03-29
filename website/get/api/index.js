module.exports = {
    path: '/api',
    run(shards, req, res) {
        return res.status(200).json({
            about: 'our cool api learn more about it at https://docs.mcstatusbot.site/api/',
            servers: null,
            users: null,
            reqDate: req.date,
            resTime: Date.now(),
            ping: (Date.now() - parseFloat(req.date)).toString() + 'ms'
        });
    }
}
