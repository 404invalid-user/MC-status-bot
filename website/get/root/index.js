const path = require('path')
module.exports = {
    path: '/',

    run(shards, req, res) {
        return res.sendFile(path.join(__dirname, '/../../www/index.html'))
    }
}
