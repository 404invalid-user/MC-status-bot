const path = require('path');
module.exports = {
    path: '/',
    dynamic: false,
    run(shards, req,res) {
        return res.sendFile(path.join(__dirname, '/../../www/index.html'));
    }
}


