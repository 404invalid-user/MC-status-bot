const path = require('path')
module.exports = {
  path: '/chart',

  run(shards, req, res) {
    res.status(200).send('/uptime.png /playersonline.png /mostactive.png')
  }
}

//TODO: make generate chart then redirect to /chart/YYYY/MM/DD/HH/name.png
