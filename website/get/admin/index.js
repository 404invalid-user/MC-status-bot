const path = require('path')
module.exports = {
    path: '/admin',

    run(shards, req, res) {
        return res.send('e')
            //return res.sendFile(path.join(__dirname, '/../../dist/index.html'));
    }
}