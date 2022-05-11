const path = require('path')
module.exports = {
    path: '/about',

    run(shards, req, res) {
        return res.sendFile(path.join(__dirname, '/../../dist/about.html'))
    }
}