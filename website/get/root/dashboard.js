const path = require('path')
module.exports = {
  path: '/dashboard',
  dynamic: false,
  run(shards, req, res) {
    return res.sendFile(path.join(__dirname, '/../../www/dashboard.html'))
  }
}
