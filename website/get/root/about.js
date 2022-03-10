const path = require('path')
module.exports = {
  path: '/about',
  dynamic: false,
  run(shards, req, res) {
    return res.sendFile(path.join(__dirname, '/../../www/about.html'))
  }
}
