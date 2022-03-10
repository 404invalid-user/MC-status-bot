const path = require('path');
module.exports = {
    path: '/admin',
    dynamic: false,
    run(shards, req,res) {
        return res.send("e")
        //return res.sendFile(path.join(__dirname, '/../../www/index.html'));
    }
}


