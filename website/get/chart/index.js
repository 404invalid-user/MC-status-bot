const path = require('path');
module.exports = {
    path: '/chart',
    dynamic: false,
    run(shards, req,res) {
       res.status(200).send("/uptime /playersonline /mostactive")
    }
}

//TODO: make generate chart then redirect to /chart/YYYY/MM/DD/HH/name.png 

