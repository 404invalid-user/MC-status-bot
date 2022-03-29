const path = require('path')
module.exports = {
    path: '/bug',

    run(shards, req, res) {
        return res.sendFile(path.join(__dirname, '/../../www/bug.html'))
    }
}
